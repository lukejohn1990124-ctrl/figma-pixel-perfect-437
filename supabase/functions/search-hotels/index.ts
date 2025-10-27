import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
            content: `You are a hotel search assistant. Extract location, check-in date, checkout date, adults, rooms, and key amenities from the user's natural language query. 

Handle city abbreviations like "NY" = "New York", "LA" = "Los Angeles", "SF" = "San Francisco", etc.

For amenities, normalize similar terms (e.g., "big bed" = "large bed", "coffee machine" = "coffee maker", "large tv" = "big tv", "air conditioned" = "air conditioning").

Return JSON with: location (city name without country), checkin (YYYY-MM-DD), checkout (YYYY-MM-DD), adults (number), children (number, default 0), rooms (number, default 1), amenities (array of normalized terms).

Example: {"location": "New York", "checkin": "2025-10-28", "checkout": "2025-10-31", "adults": 2, "children": 0, "rooms": 1, "amenities": ["coffee maker", "large bed", "city view", "air conditioning"]}`
          },
          {
            role: 'user',
            content: query
          }
        ]
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
    const extractedParams = JSON.parse(aiData.choices[0].message.content);
    
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
              content: `You are a hotel ranking assistant. Given a list of hotels and desired amenities, rank the hotels by how well they likely match the amenities. Consider semantic similarity (e.g., "coffee maker" matches "coffee machine"). Return a JSON array of hotel indices in order of best to worst match. Example: [2, 0, 5, 1, 3, 4]`
            },
            {
              role: 'user',
              content: `Desired amenities: ${extractedParams.amenities.join(', ')}\n\nHotels:\n${JSON.stringify(hotelDescriptions, null, 2)}`
            }
          ]
        }),
      });

      if (rankingResponse.ok) {
        const rankingData = await rankingResponse.json();
        const rankedIndices = JSON.parse(rankingData.choices[0].message.content);
        
        // Reorder hotels based on ranking
        const rankedHotels = rankedIndices.map((idx: number) => hotels[idx]).filter(Boolean);
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
