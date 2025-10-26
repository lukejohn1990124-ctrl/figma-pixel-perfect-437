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
    <article className="flex h-[421px] items-center shrink-0 max-md:h-auto max-sm:w-full">
      <div className="flex items-start self-stretch border bg-white rounded-[30px] border-solid border-black max-md:flex-col max-md:w-full max-md:max-w-[500px] max-sm:w-full">
        <img
          src={image}
          alt={`${title} interior`}
          className="w-[312px] self-stretch rounded-[30px] object-cover max-md:w-full max-sm:w-full"
        />
        
        <div className="flex w-[239px] flex-col items-start gap-3 self-stretch pt-2.5 pb-0 px-5 max-md:w-full max-sm:w-full">
          <h3 className="self-stretch text-black text-[31px] font-bold leading-[34.1px] tracking-[-0.93px]">
            {title}
          </h3>
          <div className="h-px self-stretch bg-black" />
          
          <div className="flex items-center gap-5 self-stretch">
            <span className="text-black text-[26px] font-bold leading-[28.6px] tracking-[-0.78px]">
              {rating}
            </span>
            <div className="flex w-[51px] justify-center items-center border bg-black px-0 py-[11px] rounded-[14px] border-solid border-black">
              <span className="text-white text-[26px] font-bold leading-[28.6px] tracking-[-0.78px]">
                {score}
              </span>
            </div>
          </div>
          
          <div className="h-px self-stretch bg-black" />
          
          <div className="flex items-start self-stretch">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/6967e7c4a24eb121907eb696389a84268aff2449?width=38"
              alt="Location icon"
              className="w-[19px] h-[19px] aspect-[1/1]"
            />
            <address className="flex-[1_0_0] text-black text-[21px] font-normal leading-[23.1px] tracking-[-0.63px] not-italic">
              {address}
            </address>
          </div>
        </div>
        
        <div className="w-px self-stretch bg-[rgba(0,0,0,0.10)]" />
        
        <div className="flex flex-col items-start gap-5 self-stretch pl-5 pr-0 py-5 max-md:p-5 max-sm:p-[15px]">
          {bookingOptions.map((option, index) => (
            <div key={index} className="flex items-center gap-[22px] pr-5 max-sm:flex-col max-sm:gap-2.5">
              <div className="flex h-[100px] flex-col items-start max-sm:w-full max-sm:text-center">
                <img
                  src={option.logo}
                  alt="Booking platform logo"
                  className="w-[150px] h-[25px] shrink-0 aspect-[6/1]"
                />
                <div className="text-black text-[26px] font-normal leading-[28.6px] tracking-[-0.78px]">
                  <div className="font-bold text-[42px]">{option.price}$</div>
                  <div className="font-normal text-[26px]">/night</div>
                </div>
                <div className="text-violet-500 text-base font-normal leading-[17.6px] tracking-[-0.48px]">
                  {option.cashback}
                </div>
              </div>
              <button
                onClick={() => handleBookNow(option)}
                className="flex h-[50px] justify-center items-center cursor-pointer bg-[#2F0FCE] p-5 rounded-[100px] hover:bg-[#2608b8] transition-colors max-sm:w-full"
              >
                <span className="text-white text-[22px] font-bold leading-[24.2px] tracking-[-0.66px]">
                  Book Now
                </span>
              </button>
            </div>
          ))}
          
          <button
            onClick={handleViewAllOptions}
            className="text-black text-[22px] font-bold leading-[24.2px] tracking-[-0.66px] cursor-pointer hover:opacity-80 transition-opacity"
          >
            View All Options
          </button>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
