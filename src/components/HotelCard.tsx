import React, { useState } from 'react';
import AllRatesOverlay from './AllRatesOverlay';

interface BookingOption {
  logo: string;
  price: number;
  cashback?: string;
  provider?: string;
  booking_url?: string;
}

interface HotelCardProps {
  image: string;
  title: string;
  rating: string;
  score: string;
  address: string;
  bookingOptions: BookingOption[];
}

const HotelCard: React.FC<HotelCardProps> = ({
  image,
  title,
  rating,
  score,
  address,
  bookingOptions
}) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleBookNow = (option: BookingOption) => {
    console.log('Booking hotel with option:', option);
    if (option.booking_url) {
      window.open(option.booking_url, '_blank');
    }
  };

  const handleViewAllOptions = () => {
    setIsOverlayOpen(true);
  };

  return (
    <>
      <AllRatesOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        hotelName={title}
        bookingOptions={bookingOptions}
      />
      
      <article className="flex items-center shrink-0 max-md:h-auto max-sm:w-full w-full justify-center">
      <div className="flex w-full max-w-[1200px] min-h-[240px] items-start border bg-white rounded-[20px] border-solid border-black shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] max-md:flex-col max-md:w-full max-md:h-auto max-sm:w-full">
        <div className="relative w-[280px] min-h-[240px] flex-shrink-0 max-md:w-full max-md:h-[200px]">
          <img
            src={image}
            alt={`${title} interior`}
            className="w-full h-full rounded-l-[20px] object-cover max-md:rounded-t-[20px] max-md:rounded-bl-none max-sm:w-full"
          />
          <div className="absolute bottom-3 right-3 flex justify-center items-center w-10 h-10 bg-white rounded-md border border-black cursor-pointer hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="6" height="6" fill="black"/>
              <rect x="12" y="2" width="6" height="6" fill="black"/>
              <rect x="2" y="12" width="6" height="6" fill="black"/>
              <rect x="12" y="12" width="6" height="6" fill="black"/>
            </svg>
          </div>
        </div>
        
        <div className="flex flex-1 flex-col items-start gap-2 self-stretch pt-3 pb-3 px-5 min-w-[240px] max-md:w-full max-sm:w-full">
          <h3 className="text-black text-[20px] font-bold leading-[22px] tracking-[-0.6px] line-clamp-2">
            {title}
          </h3>
          <div className="h-px w-full bg-black" />
          
          <div className="flex items-center gap-2">
            <span className="text-black text-[18px] font-bold leading-[20px] tracking-[-0.54px]">
              {rating}
            </span>
            <div className="flex min-w-[40px] justify-center items-center bg-black px-2 py-1 rounded-[8px]">
              <span className="text-white text-[18px] font-bold leading-[20px] tracking-[-0.54px]">
                {score}
              </span>
            </div>
          </div>
          
          <div className="h-px w-full bg-black" />
          
          <div className="flex items-start gap-1.5">
            <svg className="w-[16px] h-[16px] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="black"/>
            </svg>
            <address className="text-black text-[14px] font-normal leading-[16px] tracking-[-0.42px] not-italic line-clamp-3 flex-1">
              {address}
            </address>
          </div>
        </div>
        
        <div className="w-px self-stretch bg-[rgba(0,0,0,0.10)] max-md:hidden" />
        
        <div className="flex flex-1 flex-col items-start gap-3 self-stretch p-5 min-w-[260px] max-md:w-full max-md:pt-3 max-sm:w-full">
          {bookingOptions.slice(0, 3).map((option, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-4 w-full max-sm:flex-col max-sm:gap-3">
                <div className="flex h-fit flex-col items-start justify-start gap-0.5 min-w-[140px] max-sm:w-full">
                  <img
                    src={option.logo}
                    alt={`${option.provider || 'Booking'} logo`}
                    className="h-[20px] w-auto object-contain mb-1"
                  />
                  <div className="text-black font-normal flex items-baseline gap-0">
                    <span className="font-bold text-[28px] leading-[30px]">${option.price}</span>
                    <span className="font-normal text-[16px] leading-[18px]">/night</span>
                  </div>
                  {option.cashback && (
                    <div className="text-[#8B5CF6] text-[14px] font-bold leading-[16px] tracking-[-0.42px]">
                      {option.cashback}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleBookNow(option)}
                  className="flex min-w-[140px] h-[48px] justify-center items-center gap-2 cursor-pointer bg-[#0066FF] px-6 py-3 rounded-full hover:bg-[#0052CC] transition-colors max-sm:w-full"
                >
                  <span className="text-white text-[16px] font-bold leading-[18px] tracking-[-0.48px]">
                    Book Now
                  </span>
                  <span className="text-white text-[18px] font-bold">
                    →
                  </span>
                </button>
              </div>
              {index < Math.min(bookingOptions.length, 3) - 1 && (
                <div className="h-px w-full bg-gray-200" />
              )}
            </React.Fragment>
          ))}
          
          <button
            onClick={handleViewAllOptions}
            className="text-black text-[14px] font-normal leading-[16px] tracking-[-0.39px] cursor-pointer hover:opacity-70 transition-opacity mt-1"
          >
            View All Rates
          </button>
        </div>
      </div>
    </article>
    </>
  );
};

export default HotelCard;
