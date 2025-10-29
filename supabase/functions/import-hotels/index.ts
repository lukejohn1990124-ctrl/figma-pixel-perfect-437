import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting hotel data import...');

    // Get external Supabase credentials
    const externalUrl = Deno.env.get('EXTERNAL_SUPABASE_URL');
    const externalKey = Deno.env.get('EXTERNAL_SUPABASE_KEY');
    
    if (!externalUrl || !externalKey) {
      throw new Error('External Supabase credentials not configured');
    }

    // Get local Supabase credentials
    const localUrl = Deno.env.get('SUPABASE_URL');
    const localKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Create clients
    const externalClient = createClient(externalUrl, externalKey);
    const localClient = createClient(localUrl!, localKey!);

    // Fetch data from external database (using hyphenated table names)
    console.log('Fetching hotel options...');
    const { data: hotels, error: hotelsError } = await externalClient
      .from('hotel-options')
      .select('*');

    if (hotelsError) throw hotelsError;

    console.log('Fetching bed types...');
    const { data: bedTypes, error: bedTypesError } = await externalClient
      .from('bed-types')
      .select('*');

    if (bedTypesError) throw bedTypesError;

    console.log('Fetching provider prices...');
    const { data: prices, error: pricesError } = await externalClient
      .from('provider-prices')
      .select('*');

    if (pricesError) throw pricesError;

    // Import into local database
    let imported = { hotels: 0, bedTypes: 0, prices: 0 };

    if (hotels && hotels.length > 0) {
      console.log(`Importing ${hotels.length} hotels...`);
      const { error: insertHotelsError } = await localClient
        .from('hotel_options')
        .upsert(hotels, { onConflict: 'id' });
      
      if (insertHotelsError) throw insertHotelsError;
      imported.hotels = hotels.length;
    }

    if (bedTypes && bedTypes.length > 0) {
      console.log(`Importing ${bedTypes.length} bed types...`);
      const { error: insertBedTypesError } = await localClient
        .from('bed_types')
        .upsert(bedTypes, { onConflict: 'id' });
      
      if (insertBedTypesError) throw insertBedTypesError;
      imported.bedTypes = bedTypes.length;
    }

    if (prices && prices.length > 0) {
      console.log(`Importing ${prices.length} provider prices...`);
      const { error: insertPricesError } = await localClient
        .from('provider_prices')
        .upsert(prices, { onConflict: 'id' });
      
      if (insertPricesError) throw insertPricesError;
      imported.prices = prices.length;
    }

    console.log('Import completed successfully:', imported);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Data imported successfully',
        imported 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error importing hotel data:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
