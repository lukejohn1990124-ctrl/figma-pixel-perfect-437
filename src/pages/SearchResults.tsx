import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import HotelCard from '@/components/HotelCard';

interface Hotel {
  hotel_id: string;
  hotel_name: string;
  address: string;
  review_score: number;
  review_score_word: string;
  main_photo_url: string;
  bookingOptions?: Array<{
    logo: string;
    price: number;
    cashback?: string;
    provider?: string;
    booking_url?: string;
  }>;
}

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results = [], query = '' } = location.state || {};

  if (!results.length) {
    return (
      <>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Inria+Sans:wght@400;700&display=swap"
        />
        <div className="flex w-full min-h-screen flex-col items-start bg-[#071D5A]">
          <Header />
          <main className="flex flex-col w-full items-center justify-center py-20 px-5">
            <div className="bg-white rounded-[20px] p-10 max-w-2xl text-center">
              <h1 className="text-black text-[32px] font-bold mb-4">No Hotels Found</h1>
              <p className="text-black text-[18px] mb-6">
                We couldn't find any hotels matching your search criteria.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#155DFC] text-white px-8 py-3 rounded-[10px] hover:bg-[#1348d4] transition-colors"
              >
                Try Another Search
              </button>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Inria+Sans:wght@400;700&display=swap"
      />
      <div className="flex w-full min-h-screen flex-col items-start bg-white">
        <Header />
        
        <main className="flex flex-col w-full bg-[#F5F5F5]">
          <section className="flex flex-col items-center gap-6 self-stretch px-[145px] py-10 max-md:px-20 max-md:py-8 max-sm:px-5 max-sm:py-6">
            <button
              onClick={() => navigate('/')}
              className="self-start text-black text-[18px] hover:opacity-80 transition-opacity"
            >
              ← Back to Search
            </button>
            <p className="self-stretch text-black text-center text-[20px] font-normal leading-[22px] tracking-[-0.6px] max-md:text-[18px] max-sm:text-base">
              {query}
            </p>
          </section>

          <section className="flex flex-col justify-center items-center gap-5 self-stretch bg-[#F5F5F5] pt-[52px] pb-[107px] px-[50px]">
            <h2 className="text-black text-center text-[40px] font-bold leading-[44px] tracking-[-1.2px] max-sm:text-[28px]">
              Found {results.length} hotel{results.length !== 1 ? 's' : ''} matching your search
            </h2>
            
            <div className="flex flex-col items-center gap-8 self-stretch max-md:gap-6 max-sm:gap-5">
              {results.map((hotel: Hotel) => (
                <HotelCard
                  key={hotel.hotel_id}
                  image={hotel.main_photo_url || "https://api.builder.io/api/v1/image/assets/TEMP/bb001a322531765808eb8258dadbbc9a1fde1ea9?width=624"}
                  title={hotel.hotel_name}
                  rating={hotel.review_score_word || 'Good'}
                  score={hotel.review_score ? hotel.review_score.toFixed(1) : '7.5'}
                  address={hotel.address}
                  bookingOptions={hotel.bookingOptions || []}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default SearchResults;
