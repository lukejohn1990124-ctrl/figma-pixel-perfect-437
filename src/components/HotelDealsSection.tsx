import React from 'react';
import HotelCard from './HotelCard';

const HotelDealsSection = () => {
  const hotelData = [
    {
      image: "https://api.builder.io/api/v1/image/assets/TEMP/bb001a322531765808eb8258dadbbc9a1fde1ea9?width=624",
      title: "StaysPro - Central Los Angeles Hollywood Homes",
      rating: "Great",
      score: "8.7",
      address: "1950 S Normandie Ave, Los Angeles, CA 90007, United States",
      bookingOptions: [
        {
          logo: "https://api.builder.io/api/v1/image/assets/TEMP/3b2bf8bce7554227b68f32ffc71c1d6e77841610?width=300",
          price: 250,
          cashback: "+1.6% cashback"
        },
        {
          logo: "https://api.builder.io/api/v1/image/assets/TEMP/3b2bf8bce7554227b68f32ffc71c1d6e77841610?width=300",
          price: 250,
          cashback: "+1.6% cashback"
        },
        {
          logo: "https://api.builder.io/api/v1/image/assets/TEMP/3b2bf8bce7554227b68f32ffc71c1d6e77841610?width=300",
          price: 250,
          cashback: "+1.6% cashback"
        }
      ]
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/TEMP/bb001a322531765808eb8258dadbbc9a1fde1ea9?width=624",
      title: "StaysPro - Central Los Angeles Hollywood Homes",
      rating: "Great",
      score: "8.7",
      address: "1950 S Normandie Ave, Los Angeles, CA 90007, United States",
      bookingOptions: [
        {
          logo: "https://api.builder.io/api/v1/image/assets/TEMP/67655b0fee67ea5ad1b1315c65cff9dc7baaef63?width=300",
          price: 250,
          cashback: "+1.6% cashback"
        },
        {
          logo: "https://api.builder.io/api/v1/image/assets/TEMP/67655b0fee67ea5ad1b1315c65cff9dc7baaef63?width=300",
          price: 250,
          cashback: "+1.6% cashback"
        },
        {
          logo: "https://api.builder.io/api/v1/image/assets/TEMP/67655b0fee67ea5ad1b1315c65cff9dc7baaef63?width=300",
          price: 250,
          cashback: "+1.6% cashback"
        }
      ]
    },
    {
      image: "https://api.builder.io/api/v1/image/assets/TEMP/bb001a322531765808eb8258dadbbc9a1fde1ea9?width=624",
      title: "StaysPro - Central Los Angeles Hollywood Homes",
      rating: "Great",
      score: "8.7",
      address: "1950 S Normandie Ave, Los Angeles, CA 90007, United States",
      bookingOptions: [
        {
          logo: "https://api.builder.io/api/v1/image/assets/TEMP/67655b0fee67ea5ad1b1315c65cff9dc7baaef63?width=300",
          price: 250,
          cashback: "+1.6% cashback"
        },
        {
          logo: "https://api.builder.io/api/v1/image/assets/TEMP/67655b0fee67ea5ad1b1315c65cff9dc7baaef63?width=300",
          price: 250,
          cashback: "+1.6% cashback"
        },
        {
          logo: "https://api.builder.io/api/v1/image/assets/TEMP/67655b0fee67ea5ad1b1315c65cff9dc7baaef63?width=300",
          price: 250,
          cashback: "+1.6% cashback"
        }
      ]
    }
  ];

  return (
    <section className="flex flex-col justify-center items-center gap-5 self-stretch shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] bg-white pt-[52px] pb-[107px] px-[50px]">
      <h2 className="text-black text-center text-[40px] font-bold leading-[44px] tracking-[-1.2px] max-sm:text-[28px]">
        Today's hotel deals you don't want to miss
      </h2>
      
      <div className="flex items-center gap-[61px] self-stretch overflow-x-auto pr-5 max-md:gap-10 max-md:flex-wrap max-md:justify-center max-sm:flex-col max-sm:gap-5">
        {hotelData.map((hotel, index) => (
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
