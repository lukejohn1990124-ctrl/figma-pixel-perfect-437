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
    const { query, checkOnly = false } = await req.json();
    
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
      
    // Step 2: Search for location using Booking API
    const locationResponse = await fetch(
      `https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete?text=${encodeURIComponent(cityName)}&languagecode=en-us`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'apidojo-booking-v1.p.rapidapi.com'
        }
      }
    );

    if (!locationResponse.ok) {
      console.error('Location check failed:', locationResponse.status);
      return new Response(
        JSON.stringify({ needsCountrySelection: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const locationData = await locationResponse.json();
    console.log(`Location API returned ${locationData.length} results for "${cityName}"`);
    console.log('Full API response:', JSON.stringify(locationData, null, 2));
    
    // Get all location results and extract unique city/country combinations
    // Don't filter by dest_type - include all results (cities, regions, etc.)
    if (locationData.length > 0) {
      const uniqueCountries = new Map();
      locationData.forEach((loc: any) => {
        // Try multiple fields to get the city name
        const cityName = loc.city_name || loc.label || loc.name || loc.display_name;
        const country = loc.country || loc.country_name;
        
        console.log(`Processing location: cityName="${cityName}", country="${country}", dest_type="${loc.dest_type}"`);
        
        if (cityName && country) {
          const key = `${cityName}-${country}`;
          if (!uniqueCountries.has(key)) {
            uniqueCountries.set(key, {
              city: cityName,
              country: country
            });
          }
        }
      });

      const countryOptions = Array.from(uniqueCountries.values());
      console.log(`Found ${countryOptions.length} unique country options:`, countryOptions);
      
      // Show options if we have any cities
      if (countryOptions.length >= 1) {
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
      `https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete?text=${encodeURIComponent(extractedParams.location)}&languagecode=en-us`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'apidojo-booking-v1.p.rapidapi.com'
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
    
    if (!locationData || locationData.length === 0) {
      return new Response(
        JSON.stringify({ hotels: [] }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 4: Check if we need country disambiguation (multiple cities with same name)
    const cityMatches = locationData.filter((loc: any) => 
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

    const destId = locationData[0].dest_id;
    const lat = locationData[0].latitude;
    const lon = locationData[0].longitude;
    
    console.log('Found destination:', { destId, lat, lon, label: locationData[0].label });

    // Create a bounding box around the coordinates (approximately 20km radius)
    const latDelta = 0.18; // ~20km
    const lonDelta = 0.18;
    const bbox = `${lat - latDelta},${lat + latDelta},${lon - lonDelta},${lon + lonDelta}`;

    // Step 5: Search for hotels using Booking API
    const hotelsResponse = await fetch(
      `https://apidojo-booking-v1.p.rapidapi.com/v1/properties/list?offset=0&arrival_date=${extractedParams.checkin}&departure_date=${extractedParams.checkout}&guest_qty=${extractedParams.adults}&dest_ids=${destId}&room_qty=${extractedParams.rooms || 1}&search_type=CITY&children_qty=${extractedParams.children || 0}&price_filter_currencycode=USD&order_by=popularity&languagecode=en-us&travel_purpose=leisure`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'apidojo-booking-v1.p.rapidapi.com'
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
    
    console.log(`Found ${hotelsData.result?.length || 0} hotels`);

    // Step 6: Filter and rank hotels based on amenities if provided
    let hotels = hotelsData.result || [];
    
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
