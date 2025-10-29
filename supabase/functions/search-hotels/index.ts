import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

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
    const { query, checkOnly = false } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const MAPBOX_API_KEY = Deno.env.get('MAPBOX_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!LOVABLE_API_KEY || !MAPBOX_API_KEY) {
      console.error('Missing required API keys');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Step 1: For checkOnly mode (typing), check if country is specified
    if (checkOnly) {
      // Extract city name - handle various patterns
      let cityName = '';
      
      // Try pattern: "in [city]"
      const cityMatch = query.match(/\bin\s+([a-z\s,]+?)(?:\s+with|\s+from|\s+for|\s+on|$)/i);
      if (cityMatch && cityMatch[1].trim().length >= 3) {
        cityName = cityMatch[1].trim();
      }
      
      if (!cityName) {
        return new Response(
          JSON.stringify({ needsCountrySelection: false }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if country is already specified (contains comma)
      if (cityName.includes(',')) {
        console.log(`City already has country specified: "${cityName}"`);
        return new Response(
          JSON.stringify({ needsCountrySelection: false }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Checking city for country options: "${cityName}"`);
      
      // Step 2: Search for location using Mapbox Geocoding API
      const mapboxResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(cityName)}.json?types=place&access_token=${MAPBOX_API_KEY}&limit=10`,
        { method: 'GET' }
      );

      if (!mapboxResponse.ok) {
        console.error('Mapbox API check failed:', mapboxResponse.status);
        return new Response(
          JSON.stringify({ needsCountrySelection: false }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const mapboxData = await mapboxResponse.json();
      console.log(`Mapbox API returned ${mapboxData.features?.length || 0} results for "${cityName}"`);
      
      // Extract unique city/country combinations from Mapbox results
      if (mapboxData.features && mapboxData.features.length > 0) {
        const uniqueCountries = new Map();
        
        mapboxData.features.forEach((feature: any) => {
          const featureCityName = feature.text || feature.place_name?.split(',')[0];
          
          if (featureCityName?.toLowerCase() !== cityName.toLowerCase()) {
            return;
          }
          
          let country = '';
          if (feature.context) {
            const countryContext = feature.context.find((ctx: any) => ctx.id.startsWith('country.'));
            country = countryContext?.text || '';
          }
          
          if (featureCityName && country) {
            const key = `${featureCityName}-${country}`;
            if (!uniqueCountries.has(key)) {
              uniqueCountries.set(key, {
                city: featureCityName,
                country: country
              });
            }
          }
        });

        const countryOptions = Array.from(uniqueCountries.values());
        console.log(`Found ${countryOptions.length} unique country options:`, countryOptions);
        
        if (countryOptions.length > 1) {
          return new Response(
            JSON.stringify({ 
              needsCountrySelection: true,
              countryOptions
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      return new Response(
        JSON.stringify({ needsCountrySelection: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: For actual search, check if query has dates, rooms, and people info
    const hasDateInfo = /\b(from|to|check-?in|check-?out|january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}\/\d{1,2}|\d{4}-\d{2}-\d{2})\b/i.test(query);
    const hasPeopleInfo = /\b(\d+\s*(adult|people|person|guest)|room)\b/i.test(query);

    if (!hasDateInfo || !hasPeopleInfo) {
      console.log('Missing date or people information');
      return new Response(
        JSON.stringify({ needsDateInfo: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 3: Use Lovable AI to extract search parameters from natural language
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

    // Step 4: Query local database for hotels
    let queryBuilder = supabase
      .from('hotel_options')
      .select('*');
    
    // Filter by city or hotel name if provided
    if (extractedParams.location) {
      queryBuilder = queryBuilder.or(`city.ilike.%${extractedParams.location}%,hotel_name.ilike.%${extractedParams.location}%`);
    }

    const { data: hotels, error } = await queryBuilder;

    if (error) {
      console.error('Database query error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to search hotels' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${hotels?.length || 0} hotels in database`);

    if (!hotels || hotels.length === 0) {
      return new Response(
        JSON.stringify({ hotels: [], query: extractedParams }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 5: Get provider prices for each hotel (top 3 cheapest)
    const hotelsWithPrices = await Promise.all(
      hotels.map(async (hotel) => {
        const { data: prices, error: priceError } = await supabase
          .from('provider_prices')
          .select('*')
          .eq('hotel_id', hotel.id)
          .order('price_per_night', { ascending: true })
          .limit(3);

        if (priceError) {
          console.error('Price query error for hotel:', hotel.id, priceError);
        }

        // Format to match expected structure
        const bookingOptions = (prices || []).map(price => ({
          logo: price.provider_logo_url || 'https://api.builder.io/api/v1/image/assets/TEMP/booking-logo',
          price: price.price_per_night,
          cashback: price.cashback_percentage ? `+${price.cashback_percentage}% cashback` : '',
          provider: price.provider_name,
          booking_url: price.booking_url || '#'
        }));

        return {
          hotel_id: hotel.id,
          hotel_name: hotel.hotel_name,
          review_score: hotel.rating_score,
          review_score_word: hotel.rating_word || 'Good',
          address: hotel.address,
          main_photo_url: hotel.main_photo_url,
          city_name: hotel.city,
          country: hotel.country,
          latitude: hotel.latitude,
          longitude: hotel.longitude,
          amenities: hotel.amenities || [],
          bookingOptions
        };
      })
    );

    let processedHotels = hotelsWithPrices;

    // Step 6: Filter and rank hotels based on amenities if provided
    if (extractedParams.amenities && extractedParams.amenities.length > 0 && processedHotels.length > 0) {
      // Use AI to rank hotels based on amenity matching
      const hotelDescriptions = processedHotels.slice(0, 10).map((hotel: any, index: number) => ({
        index,
        name: hotel.hotel_name,
        description: `${hotel.hotel_name} - ${hotel.review_score_word || ''} (${hotel.review_score || 'N/A'}) - Amenities: ${hotel.amenities?.join(', ') || 'None listed'}`
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
        const rankedHotels = ranked_indices.map((idx: number) => processedHotels[idx]).filter(Boolean);
        processedHotels = [...rankedHotels, ...processedHotels.filter((h: any) => !rankedHotels.includes(h))];
        
        console.log('Hotels ranked by amenity match');
      }
    }

    return new Response(
      JSON.stringify({ 
        hotels: processedHotels.slice(0, 20),
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
