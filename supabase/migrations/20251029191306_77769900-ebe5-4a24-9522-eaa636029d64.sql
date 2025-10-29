-- Update hotel_reviews to use 1-10 scale for all rating categories
UPDATE hotel_reviews
SET 
  facilities = facilities / 10,
  food_quality = food_quality / 10,
  room_quality = room_quality / 10,
  cleanliness = cleanliness / 10,
  friendly_staff = friendly_staff / 10,
  value_for_money = value_for_money / 10,
  location = location / 10,
  comfort = comfort / 10;