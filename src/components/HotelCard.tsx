import React from 'react';

interface BookingOption {
  logo: string;
  price: number;
  cashback: string;
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
  const handleBookNow = (option: BookingOption) => {
    console.log('Booking hotel with option:', option);
    // Here you would typically redirect to the booking platform
  };

  const handleViewAllOptions = () => {
    console.log('View all options for:', title);
    // Here you would typically show more booking options
  };

  return (
    <article className="flex items-center shrink-0 max-md:h-auto max-sm:w-full">
      <div className="flex w-[17cm] h-[6.4cm] items-start border bg-white rounded-[20px] border-solid border-black max-md:flex-col max-md:w-full max-md:h-auto max-sm:w-full">
        <img
          src={image}
          alt={`${title} interior`}
          className="w-[5.44cm] h-[6.4cm] rounded-l-[20px] object-cover max-md:w-full max-md:h-[200px] max-md:rounded-t-[20px] max-md:rounded-bl-none max-sm:w-full"
        />
        
        <div className="flex w-[6.2cm] flex-col items-start gap-2 self-stretch pt-3 pb-3 px-5 max-md:w-full max-sm:w-full">
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
        
        <div className="flex flex-col items-start gap-3 self-stretch p-5 max-md:w-full max-md:pt-3 max-sm:w-full">
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
          
          {bookingOptions.length > 3 && (
            <button
              onClick={handleViewAllOptions}
              className="text-black text-[14px] font-normal leading-[16px] tracking-[-0.39px] cursor-pointer hover:opacity-70 transition-opacity mt-1 flex items-center gap-1"
            >
              <span>View All Rates</span>
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path d="M6 3v6M3 6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
