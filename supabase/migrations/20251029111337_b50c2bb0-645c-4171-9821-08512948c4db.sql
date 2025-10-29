-- Create hotel_options table
CREATE TABLE public.hotel_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  country TEXT,
  brand TEXT,
  view_style TEXT,
  location TEXT,
  main_photo_url TEXT,
  amenities TEXT[],
  rating_word TEXT,
  rating_score NUMERIC(3,1),
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bed_types table
CREATE TABLE public.bed_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID REFERENCES public.hotel_options(id) ON DELETE CASCADE NOT NULL,
  bed_type TEXT NOT NULL,
  cost NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create provider_prices table for different booking providers
CREATE TABLE public.provider_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID REFERENCES public.hotel_options(id) ON DELETE CASCADE NOT NULL,
  provider_name TEXT NOT NULL,
  provider_logo_url TEXT,
  price_per_night NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  cashback_percentage NUMERIC(4,2),
  booking_url TEXT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(hotel_id, provider_name)
);

-- Enable Row Level Security
ALTER TABLE public.hotel_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bed_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_prices ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth needed for viewing hotels)
CREATE POLICY "Allow public read access to hotels" 
  ON public.hotel_options FOR SELECT USING (true);

CREATE POLICY "Allow public read access to bed types" 
  ON public.bed_types FOR SELECT USING (true);

CREATE POLICY "Allow public read access to provider prices" 
  ON public.provider_prices FOR SELECT USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_hotel_options_city ON public.hotel_options(city);
CREATE INDEX idx_hotel_options_country ON public.hotel_options(country);
CREATE INDEX idx_bed_types_hotel_id ON public.bed_types(hotel_id);
CREATE INDEX idx_provider_prices_hotel_id ON public.provider_prices(hotel_id);
CREATE INDEX idx_provider_prices_price ON public.provider_prices(price_per_night);