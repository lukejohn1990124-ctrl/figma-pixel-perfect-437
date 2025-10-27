import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to clean JSON responses from markdown code blocks
function cleanJsonResponse(jsonString: string): string {
  let cleaned = jsonString.trim();
  
  // Remove markdown code blocks if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '');
  }
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  
  return cleaned.trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');

    if (!LOVABLE_API_KEY || !RAPIDAPI_KEY) {
      console.error('Missing required API keys');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Check if query has dates, rooms, and people info
    const hasDateInfo = /\b(from|to|check-?in|check-?out|january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}\/\d{1,2}|\d{4}-\d{2}-\d{2})\b/i.test(query);
    const hasPeopleInfo = /\b(\d+\s*(adult|people|person|guest)|room)\b/i.test(query);

    if (!hasDateInfo || !hasPeopleInfo) {
      console.log('Missing date or people information');
      return new Response(
        JSON.stringify({ needsDateInfo: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Use Lovable AI to extract search parameters from natural language
    console.log('Processing search query with AI:', query);
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a hotel search assistant that extracts structured information from natural language queries about hotel searches.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_search_params',
              description: 'Extract hotel search parameters from natural language query',
              parameters: {
                type: 'object',
                properties: {
                  location: {
                    type: 'string',
                    description: 'City name without country. Handle abbreviations like NY=New York, LA=Los Angeles, SF=San Francisco'
                  },
                  checkin: {
                    type: 'string',
                    description: 'Check-in date in YYYY-MM-DD format'
                  },
                  checkout: {
                    type: 'string',
                    description: 'Check-out date in YYYY-MM-DD format'
                  },
                  adults: {
                    type: 'number',
                    description: 'Number of adults'
                  },
                  children: {
                    type: 'number',
                    description: 'Number of children, default 0'
                  },
                  rooms: {
                    type: 'number',
                    description: 'Number of rooms, default 1'
                  },
                  amenities: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of amenities. Normalize similar terms: big bed=large bed, coffee machine=coffee maker, large tv=big tv, air conditioned=air conditioning'
                  }
                },
                required: ['location', 'checkin', 'checkout', 'adults'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'extract_search_params' } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to process search query' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices[0].message.tool_calls[0];
    const cleanedArgs = cleanJsonResponse(toolCall.function.arguments);
    const extractedParams = JSON.parse(cleanedArgs);
    
    // Set defaults
    extractedParams.children = extractedParams.children || 0;
    extractedParams.rooms = extractedParams.rooms || 1;
    extractedParams.amenities = extractedParams.amenities || [];
    
    console.log('Extracted parameters:', extractedParams);

    // Step 3: Search for location using Booking API
    const locationResponse = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(extractedParams.location)}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
        }
      }
    );

    if (!locationResponse.ok) {
      const errorText = await locationResponse.text();
      console.error('Location API error:', locationResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to find location' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const locationData = await locationResponse.json();
    
    if (!locationData.data || locationData.data.length === 0) {
      return new Response(
        JSON.stringify({ hotels: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 4: Check if we need country disambiguation (multiple cities with same name)
    const cityMatches = locationData.data.filter((loc: any) => 
      loc.dest_type === 'city' && 
      loc.city_name?.toLowerCase() === extractedParams.location.toLowerCase()
    );

    if (cityMatches.length > 1) {
      // Multiple cities with same name - need country selection
      const uniqueCountries = new Map();
      cityMatches.forEach((loc: any) => {
        const key = `${loc.city_name}-${loc.country}`;
        if (!uniqueCountries.has(key)) {
          uniqueCountries.set(key, {
            city: loc.city_name,
            country: loc.country
          });
        }
      });

      const countryOptions = Array.from(uniqueCountries.values());
      
      if (countryOptions.length > 1) {
        console.log('Multiple countries found for city:', extractedParams.location);
        return new Response(
          JSON.stringify({ 
            needsCountrySelection: true,
            countryOptions
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const destId = locationData.data[0].dest_id;
    
    console.log('Found destination ID:', destId);

    // Step 5: Search for hotels
    const hotelsResponse = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?dest_id=${destId}&search_type=CITY&arrival_date=${extractedParams.checkin}&departure_date=${extractedParams.checkout}&adults=${extractedParams.adults}&children_age=${extractedParams.children > 0 ? '0' : ''}&room_qty=${extractedParams.rooms || 1}&page_number=1&units=metric&temperature_unit=c&languagecode=en-us&currency_code=USD`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
        }
      }
    );

    if (!hotelsResponse.ok) {
      const errorText = await hotelsResponse.text();
      console.error('Hotels API error:', hotelsResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to search hotels' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const hotelsData = await hotelsResponse.json();
    
    console.log(`Found ${hotelsData.data?.hotels?.length || 0} hotels`);

    // Step 6: Filter and rank hotels based on amenities if provided
    let hotels = hotelsData.data?.hotels || [];
    
    if (extractedParams.amenities && extractedParams.amenities.length > 0 && hotels.length > 0) {
      // Use AI to rank hotels based on amenity matching
      const hotelDescriptions = hotels.slice(0, 10).map((hotel: any, index: number) => ({
        index,
        name: hotel.hotel_name,
        description: `${hotel.hotel_name} - ${hotel.review_score_word || ''} (${hotel.review_score || 'N/A'}) - ${hotel.address || ''}`
      }));

      const rankingResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: 'You rank hotels based on how well they match desired amenities.'
            },
            {
              role: 'user',
              content: `Desired amenities: ${extractedParams.amenities.join(', ')}\n\nHotels:\n${JSON.stringify(hotelDescriptions, null, 2)}`
            }
          ],
          tools: [
            {
              type: 'function',
              function: {
                name: 'rank_hotels',
                description: 'Rank hotels by amenity match quality',
                parameters: {
                  type: 'object',
                  properties: {
                    ranked_indices: {
                      type: 'array',
                      items: { type: 'number' },
                      description: 'Array of hotel indices ordered from best to worst match'
                    }
                  },
                  required: ['ranked_indices'],
                  additionalProperties: false
                }
              }
            }
          ],
          tool_choice: { type: 'function', function: { name: 'rank_hotels' } }
        }),
      });

      if (rankingResponse.ok) {
        const rankingData = await rankingResponse.json();
        const rankingToolCall = rankingData.choices[0].message.tool_calls[0];
        const cleanedRankingArgs = cleanJsonResponse(rankingToolCall.function.arguments);
        const { ranked_indices } = JSON.parse(cleanedRankingArgs);
        
        // Reorder hotels based on ranking
        const rankedHotels = ranked_indices.map((idx: number) => hotels[idx]).filter(Boolean);
        hotels = [...rankedHotels, ...hotels.filter((h: any) => !rankedHotels.includes(h))];
        
        console.log('Hotels ranked by amenity match');
      }
    }

    return new Response(
      JSON.stringify({ 
        hotels: hotels.slice(0, 20),
        query: extractedParams 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in search-hotels function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
