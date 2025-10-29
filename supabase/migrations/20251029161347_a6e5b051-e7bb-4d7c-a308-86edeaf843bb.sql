-- Fix security definer view issue by recreating with security_invoker
DROP VIEW IF EXISTS hotel_rating_summary;

CREATE VIEW hotel_rating_summary 
WITH (security_invoker = true) AS
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

-- Fix function search path mutable issue
CREATE OR REPLACE FUNCTION update_hotel_ratings()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;