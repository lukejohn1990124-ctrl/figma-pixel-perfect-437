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
    <article className="flex h-[6.4cm] items-center shrink-0 max-md:h-auto max-sm:w-full">
      <div className="flex w-[18cm] h-[6.4cm] items-start border bg-white rounded-[20px] border-solid border-black max-md:flex-col max-md:w-full max-md:h-auto max-sm:w-full">
        <img
          src={image}
          alt={`${title} interior`}
          className="w-[5.44cm] h-[6.4cm] rounded-l-[20px] object-cover max-md:w-full max-md:h-auto max-md:rounded-t-[20px] max-md:rounded-bl-none max-sm:w-full"
        />
        
        <div className="flex w-[6.2cm] flex-col items-start gap-2 self-stretch pt-2 pb-0 p-5 max-md:w-full max-sm:w-full">
          <h3 className="text-black text-[20px] font-bold leading-[22px] tracking-[-0.6px] line-clamp-2">
            {title}
          </h3>
          <div className="h-px w-full bg-black" />
          
          <div className="flex items-center gap-2">
            <span className="text-black text-[18px] font-bold leading-[20px] tracking-[-0.54px]">
              {rating}
            </span>
            <div className="flex w-[40px] justify-center items-center border bg-black px-0 py-1 rounded-[8px] border-solid border-black">
              <span className="text-white text-[18px] font-bold leading-[20px] tracking-[-0.54px]">
                {score}
              </span>
            </div>
          </div>
          
          <div className="h-px w-full bg-black" />
          
          <div className="flex items-start gap-1">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/6967e7c4a24eb121907eb696389a84268aff2449?width=38"
              alt="Location icon"
              className="w-[16px] h-[16px] aspect-[1/1] mt-0.5"
            />
            <address className="text-black text-[14px] font-normal leading-[16px] tracking-[-0.42px] not-italic line-clamp-3">
              {address}
            </address>
          </div>
        </div>
        
        <div className="w-px self-stretch bg-[rgba(0,0,0,0.10)]" />
        
        <div className="flex flex-col items-start gap-3 self-stretch p-5 max-md:p-5 max-sm:p-5">
          {bookingOptions.map((option, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-3 max-sm:flex-col max-sm:gap-2">
                <div className="flex h-fit flex-col items-start justify-start gap-1 max-sm:w-full">
                  <img
                    src={option.logo}
                    alt="Booking platform logo"
                    className="w-[100px] h-[18px] shrink-0"
                  />
                  <div className="text-black font-normal">
                    <div className="font-bold text-[24px] leading-[26px]">{option.price}$</div>
                    <div className="font-normal text-[15px] leading-[17px]">/night</div>
                  </div>
                  <div className="text-violet-500 text-[14px] font-bold leading-[15px] tracking-[-0.42px]">
                    {option.cashback}
                  </div>
                </div>
                <button
                  onClick={() => handleBookNow(option)}
                  className="flex w-[3.25cm] h-[1.2cm] justify-center items-center gap-1.5 cursor-pointer bg-[#2F0FCE] px-3 py-2 rounded-[100px] hover:bg-[#2608b8] transition-colors max-sm:w-full"
                >
                  <span className="text-white text-[16px] font-bold leading-[18px] tracking-[-0.48px]">
                    Book Now
                  </span>
                  <span className="text-white text-[16px] font-bold leading-[18px] w-[0.5cm] text-center">
                    →
                  </span>
                </button>
              </div>
              {index < bookingOptions.length - 1 && (
                <div className="h-px w-full bg-gray-300" />
              )}
            </React.Fragment>
          ))}
          
          <button
            onClick={handleViewAllOptions}
            className="text-black text-[13px] font-normal leading-[14px] tracking-[-0.39px] cursor-pointer hover:opacity-80 transition-opacity mt-2"
          >
            View All Options
          </button>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
