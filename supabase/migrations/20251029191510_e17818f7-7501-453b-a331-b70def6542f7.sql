-- Round all rating categories to 1 decimal place
UPDATE hotel_reviews
SET 
  facilities = ROUND(facilities::numeric, 1),
  food_quality = ROUND(food_quality::numeric, 1),
  room_quality = ROUND(room_quality::numeric, 1),
  cleanliness = ROUND(cleanliness::numeric, 1),
  friendly_staff = ROUND(friendly_staff::numeric, 1),
  value_for_money = ROUND(value_for_money::numeric, 1),
  location = ROUND(location::numeric, 1),
  comfort = ROUND(comfort::numeric, 1);