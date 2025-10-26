import React from 'react';

interface BookingOption {
  logo: string;
  price: number;
  cashback: string;
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
    <article className="flex h-[242px] items-center shrink-0 max-md:h-auto max-sm:w-full">
      <div className="flex w-[680px] h-[242px] items-start border bg-white rounded-[20px] border-solid border-black max-md:flex-col max-md:w-full max-md:h-auto max-sm:w-full">
        <img
          src={image}
          alt={`${title} interior`}
          className="w-[206px] h-[242px] rounded-l-[20px] object-cover max-md:w-full max-md:h-auto max-md:rounded-t-[20px] max-md:rounded-bl-none max-sm:w-full"
        />
        
        <div className="flex w-[160px] flex-col items-start gap-2 self-stretch pt-2 pb-0 px-3 max-md:w-full max-sm:w-full">
          <h3 className="self-stretch text-black text-[16px] font-bold leading-[18px] tracking-[-0.48px] line-clamp-2">
            {title}
          </h3>
          <div className="h-px self-stretch bg-black" />
          
          <div className="flex items-center gap-2 self-stretch">
            <span className="text-black text-[14px] font-bold leading-[16px] tracking-[-0.42px]">
              {rating}
            </span>
            <div className="flex w-[32px] justify-center items-center border bg-black px-0 py-1 rounded-[8px] border-solid border-black">
              <span className="text-white text-[14px] font-bold leading-[16px] tracking-[-0.42px]">
                {score}
              </span>
            </div>
          </div>
          
          <div className="h-px self-stretch bg-black" />
          
          <div className="flex items-start gap-1 self-stretch">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/6967e7c4a24eb121907eb696389a84268aff2449?width=38"
              alt="Location icon"
              className="w-[12px] h-[12px] aspect-[1/1] mt-0.5"
            />
            <address className="flex-[1_0_0] text-black text-[11px] font-normal leading-[13px] tracking-[-0.33px] not-italic line-clamp-3">
              {address}
            </address>
          </div>
        </div>
        
        <div className="w-px self-stretch bg-[rgba(0,0,0,0.10)]" />
        
        <div className="flex flex-col items-start gap-2 self-stretch pl-3 pr-0 py-2 max-md:p-3 max-sm:p-2">
          {bookingOptions.map((option, index) => (
            <div key={index} className="flex items-center gap-2 pr-3 max-sm:flex-col max-sm:gap-1.5">
              <div className="flex h-[60px] flex-col items-start justify-between max-sm:w-full">
                <img
                  src={option.logo}
                  alt="Booking platform logo"
                  className="w-[80px] h-[14px] shrink-0"
                />
                <div className="text-black font-normal">
                  <div className="font-bold text-[20px] leading-[22px]">{option.price}$</div>
                  <div className="font-normal text-[12px] leading-[14px]">/night</div>
                </div>
                <div className="text-violet-500 text-[10px] font-normal leading-[11px] tracking-[-0.3px]">
                  {option.cashback}
                </div>
              </div>
              <button
                onClick={() => handleBookNow(option)}
                className="flex h-[28px] justify-center items-center cursor-pointer bg-[#2F0FCE] px-3 py-1 rounded-[100px] hover:bg-[#2608b8] transition-colors max-sm:w-full"
              >
                <span className="text-white text-[12px] font-bold leading-[14px] tracking-[-0.36px]">
                  Book Now
                </span>
              </button>
            </div>
          ))}
          
          <button
            onClick={handleViewAllOptions}
            className="text-black text-[12px] font-bold leading-[14px] tracking-[-0.36px] cursor-pointer hover:opacity-80 transition-opacity"
          >
            View All Options
          </button>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
