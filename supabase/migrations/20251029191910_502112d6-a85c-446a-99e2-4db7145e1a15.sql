-- Update hotel_options rating_score to 1-10 scale
UPDATE hotel_options
SET rating_score = ROUND((rating_score / 10)::numeric, 1);