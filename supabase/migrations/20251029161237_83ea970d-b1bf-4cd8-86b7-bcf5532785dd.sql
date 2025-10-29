-- Create hotel_reviews table
CREATE TABLE IF NOT EXISTS hotel_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES hotel_options(id) ON DELETE CASCADE,
  provider_name text NOT NULL,
  friendly_staff numeric NOT NULL CHECK (friendly_staff >= 0 AND friendly_staff <= 100),
  cleanliness numeric NOT NULL CHECK (cleanliness >= 0 AND cleanliness <= 100),
  value_for_money numeric NOT NULL CHECK (value_for_money >= 0 AND value_for_money <= 100),
  location numeric NOT NULL CHECK (location >= 0 AND location <= 100),
  comfort numeric NOT NULL CHECK (comfort >= 0 AND comfort <= 100),
  facilities numeric NOT NULL CHECK (facilities >= 0 AND facilities <= 100),
  food_quality numeric NOT NULL CHECK (food_quality >= 0 AND food_quality <= 100),
  room_quality numeric NOT NULL CHECK (room_quality >= 0 AND room_quality <= 100),
  created_at timestamp with time zone DEFAULT now()
);

-- Add index for faster aggregation
CREATE INDEX idx_hotel_reviews_hotel_id ON hotel_reviews(hotel_id);

-- Enable RLS
ALTER TABLE hotel_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to reviews"
  ON hotel_reviews FOR SELECT
  TO public
  USING (true);

-- Create hotel_rating_summary view
CREATE OR REPLACE VIEW hotel_rating_summary AS
SELECT 
  hotel_id,
  ROUND(
    (AVG(friendly_staff) + AVG(cleanliness) + AVG(value_for_money) + 
     AVG(location) + AVG(comfort) + AVG(facilities) + 
     AVG(food_quality) + AVG(room_quality)) / 8, 
    2
  ) AS rating_score,
  CASE 
    WHEN (AVG(friendly_staff) + AVG(cleanliness) + AVG(value_for_money) + 
          AVG(location) + AVG(comfort) + AVG(facilities) + 
          AVG(food_quality) + AVG(room_quality)) / 8 < 50 THEN 'Poor'
    WHEN (AVG(friendly_staff) + AVG(cleanliness) + AVG(value_for_money) + 
          AVG(location) + AVG(comfort) + AVG(facilities) + 
          AVG(food_quality) + AVG(room_quality)) / 8 < 65 THEN 'Fair'
    WHEN (AVG(friendly_staff) + AVG(cleanliness) + AVG(value_for_money) + 
          AVG(location) + AVG(comfort) + AVG(facilities) + 
          AVG(food_quality) + AVG(room_quality)) / 8 < 75 THEN 'Good'
    WHEN (AVG(friendly_staff) + AVG(cleanliness) + AVG(value_for_money) + 
          AVG(location) + AVG(comfort) + AVG(facilities) + 
          AVG(food_quality) + AVG(room_quality)) / 8 < 85 THEN 'Very Good'
    WHEN (AVG(friendly_staff) + AVG(cleanliness) + AVG(value_for_money) + 
          AVG(location) + AVG(comfort) + AVG(facilities) + 
          AVG(food_quality) + AVG(room_quality)) / 8 < 92 THEN 'Excellent'
    ELSE 'Exceptional'
  END AS rating_word,
  COUNT(*) AS total_reviews
FROM hotel_reviews
GROUP BY hotel_id;

-- Create function to update hotel ratings
CREATE OR REPLACE FUNCTION update_hotel_ratings()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE hotel_options ho
  SET 
    rating_score = hrs.rating_score,
    rating_word = hrs.rating_word
  FROM hotel_rating_summary hrs
  WHERE ho.id = hrs.hotel_id
    AND (
      COALESCE(NEW.hotel_id, OLD.hotel_id) = hrs.hotel_id
    );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger on hotel_reviews
CREATE TRIGGER trigger_update_hotel_ratings
AFTER INSERT OR UPDATE OR DELETE ON hotel_reviews
FOR EACH ROW
EXECUTE FUNCTION update_hotel_ratings();

-- Generate 6,400 review records (40 hotels × 8 providers × 20 reviews)
INSERT INTO hotel_reviews (hotel_id, provider_name, friendly_staff, cleanliness, value_for_money, location, comfort, facilities, food_quality, room_quality)
SELECT 
  h.id AS hotel_id,
  p.provider_name,
  50 + (random() * 45)::numeric AS friendly_staff,
  50 + (random() * 45)::numeric AS cleanliness,
  50 + (random() * 45)::numeric AS value_for_money,
  50 + (random() * 45)::numeric AS location,
  50 + (random() * 45)::numeric AS comfort,
  50 + (random() * 45)::numeric AS facilities,
  50 + (random() * 45)::numeric AS food_quality,
  50 + (random() * 45)::numeric AS room_quality
FROM 
  hotel_options h
CROSS JOIN (
  SELECT DISTINCT provider_name 
  FROM provider_prices
) p
CROSS JOIN generate_series(1, 20) review_number;