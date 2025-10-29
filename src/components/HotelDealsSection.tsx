import React from 'react';
import HotelCard from './HotelCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const HotelDealsSection = () => {
  const { data: hotels, isLoading } = useQuery({
    queryKey: ['featured-hotels'],
    queryFn: async () => {
      const { data: hotelsData, error: hotelsError } = await supabase
        .from('hotel_options')
        .select('*')
        .order('rating_score', { ascending: false })
        .limit(3);
      
      if (hotelsError) throw hotelsError;

      // Fetch prices for each hotel
      const hotelsWithPrices = await Promise.all(
        (hotelsData || []).map(async (hotel) => {
          const { data: prices } = await supabase
            .from('provider_prices')
            .select('*')
            .eq('hotel_id', hotel.id)
            .order('price_per_night', { ascending: true })
            .limit(3);

          return {
            image: hotel.main_photo_url || "https://api.builder.io/api/v1/image/assets/TEMP/bb001a322531765808eb8258dadbbc9a1fde1ea9?width=624",
            title: hotel.hotel_name,
            rating: hotel.rating_word || "Good",
            score: hotel.rating_score ? hotel.rating_score.toFixed(1) : "7.5",
            address: hotel.address,
            bookingOptions: (prices || []).map(price => ({
              logo: price.provider_logo_url || "https://api.builder.io/api/v1/image/assets/TEMP/3b2bf8bce7554227b68f32ffc71c1d6e77841610?width=300",
              price: Number(price.price_per_night),
              cashback: price.cashback_percentage ? `+${price.cashback_percentage}% cashback` : undefined,
              provider: price.provider_name,
              url: price.booking_url
            }))
          };
        })
      );

      return hotelsWithPrices;
    }
  });

  if (isLoading) {
    return (
      <section className="flex flex-col justify-center items-center gap-5 self-stretch shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-white pt-[52px] pb-[107px] px-[50px]">
        <h2 className="text-black text-center text-[40px] font-bold leading-[44px] tracking-[-1.2px] max-sm:text-[28px]">
          Loading hotel deals...
        </h2>
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-center items-center gap-5 self-stretch shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-white pt-[52px] pb-[107px] px-[50px]">
      <h2 className="text-black text-center text-[40px] font-bold leading-[44px] tracking-[-1.2px] max-sm:text-[28px]">
        Today's hotel deals you don't want to miss
      </h2>
      
      <div className="flex items-center gap-[61px] self-stretch overflow-x-auto pr-5 max-md:gap-10 max-md:flex-wrap max-md:justify-center max-sm:flex-col max-sm:gap-5">
        {(hotels || []).map((hotel, index) => (
          <HotelCard
            key={index}
            image={hotel.image}
            title={hotel.title}
            rating={hotel.rating}
            score={hotel.score}
            address={hotel.address}
            bookingOptions={hotel.bookingOptions}
          />
        ))}
      </div>
      
      <h2 className="text-black text-center text-[40px] font-bold leading-[44px] tracking-[-1.2px] mt-10 max-sm:text-[28px]">
        Don't Let These{' '}
        <span className="text-amber-600">Fall</span>{' '}
        Deals{' '}
        <span className="text-amber-700">Fall away</span>
      </h2>
    </section>
  );
};

export default HotelDealsSection;
