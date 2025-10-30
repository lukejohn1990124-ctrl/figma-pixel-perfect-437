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
      
      <article className="flex items-center shrink-0 w-full justify-center max-md:h-auto max-sm:w-full">
      <div className="flex w-full max-w-[900px] items-stretch border bg-white rounded-[20px] border-solid border-black shadow-[0_2px_8px_0_rgba(0,0,0,0.1)] overflow-hidden max-md:flex-col max-md:w-full max-sm:w-full">
        {/* Hotel Image - 1/3 width */}
        <div className="relative w-[300px] flex-shrink-0 max-md:w-full max-md:h-[240px]">
          <img
            src={image}
            alt={`${title} interior`}
            className="w-full h-full object-cover"
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
        
        {/* Hotel Info - 1/3 width */}
        <div className="flex flex-col items-start justify-start gap-2 w-[300px] flex-shrink-0 pt-4 pb-4 px-5 max-md:w-full max-sm:w-full">
          <h3 className="text-black text-[20px] font-bold leading-[24px] tracking-[-0.6px] line-clamp-2">
            {title}
          </h3>
          <div className="h-px w-full bg-black" />
          
          <div className="flex items-center gap-2">
            <span className="text-black text-[18px] font-normal leading-[20px] tracking-[-0.54px]">
              {rating}
            </span>
            <div className="flex min-w-[48px] justify-center items-center bg-black px-3 py-1.5 rounded-[8px]">
              <span className="text-white text-[18px] font-bold leading-[20px] tracking-[-0.54px]">
                {score}
              </span>
            </div>
          </div>
          
          <div className="h-px w-full bg-black" />
          
          <div className="flex items-start gap-1.5">
            <svg className="w-[18px] h-[18px] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="black"/>
            </svg>
            <address className="text-black text-[14px] font-normal leading-[18px] tracking-[-0.42px] not-italic line-clamp-4 flex-1">
              {address}
            </address>
          </div>
        </div>
        
        {/* Vertical Divider */}
        <div className="w-px bg-black max-md:hidden" />
        
        {/* Booking Options - 1/3 width */}
        <div className="flex flex-col items-start justify-start gap-2.5 w-[300px] flex-shrink-0 pt-4 pb-4 px-5 max-md:w-full max-md:border-t max-md:border-black max-sm:w-full">
          {bookingOptions.slice(0, 3).map((option, index) => (
            <div key={index} className="flex flex-col gap-1.5 w-full">
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex flex-col items-start gap-0.5">
                  <img
                    src={option.logo}
                    alt={`${option.provider || 'Booking'} logo`}
                    className="h-[18px] w-auto object-contain"
                  />
                  <div className="text-black font-normal flex items-baseline gap-0.5">
                    <span className="font-bold text-[24px] leading-[26px]">${option.price}</span>
                    <span className="font-normal text-[14px] leading-[16px]">/night</span>
                  </div>
                  {option.cashback && (
                    <div className="text-[#8B5CF6] text-[12px] font-normal leading-[14px]">
                      {option.cashback}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleBookNow(option)}
                  className="flex h-[40px] justify-center items-center gap-1.5 cursor-pointer bg-[#0000FF] px-5 py-2 rounded-full hover:bg-[#0000CC] transition-colors whitespace-nowrap"
                >
                  <span className="text-white text-[14px] font-bold leading-[16px]">
                    Book Now
                  </span>
                  <span className="text-white text-[16px] font-bold">
                    →
                  </span>
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={handleViewAllOptions}
            className="text-black text-[14px] font-normal leading-[16px] underline cursor-pointer hover:opacity-70 transition-opacity mt-1"
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
