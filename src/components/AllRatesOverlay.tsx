import React from 'react';

interface BookingOption {
  logo: string;
  price: number;
  cashback?: string;
  provider?: string;
  booking_url?: string;
}

interface AllRatesOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  hotelName: string;
  bookingOptions: BookingOption[];
}

const AllRatesOverlay: React.FC<AllRatesOverlayProps> = ({
  isOpen,
  onClose,
  hotelName,
  bookingOptions
}) => {
  if (!isOpen) return null;

  const handleBookNow = (option: BookingOption) => {
    console.log('Booking hotel with option:', option);
    if (option.booking_url) {
      window.open(option.booking_url, '_blank');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[20px] max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-[20px] z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-black text-[24px] font-bold leading-[26px] tracking-[-0.72px] mb-1">
                All Available Rates
              </h2>
              <p className="text-black/60 text-[16px] font-normal leading-[18px] tracking-[-0.48px]">
                {hotelName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-black/40 hover:text-black transition-colors p-1"
              aria-label="Close overlay"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {bookingOptions.map((option, index) => (
            <div 
              key={index}
              className="flex items-center justify-between gap-4 p-4 border border-gray-200 rounded-[12px] hover:border-gray-300 transition-colors"
            >
              <div className="flex flex-col gap-2 flex-1">
                <img
                  src={option.logo}
                  alt={`${option.provider || 'Booking'} logo`}
                  className="h-[24px] w-auto object-contain"
                />
                <div className="flex items-baseline gap-1">
                  <span className="text-black font-bold text-[24px] leading-[26px]">
                    ${option.price}
                  </span>
                  <span className="text-black/60 font-normal text-[14px] leading-[16px]">
                    /night
                  </span>
                </div>
                {option.cashback && (
                  <div className="text-[#8B5CF6] text-[14px] font-bold leading-[16px] tracking-[-0.42px]">
                    {option.cashback}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => handleBookNow(option)}
                className="flex min-w-[140px] h-[44px] justify-center items-center gap-2 cursor-pointer bg-[#0066FF] px-6 py-2.5 rounded-full hover:bg-[#0052CC] transition-colors"
              >
                <span className="text-white text-[14px] font-bold leading-[16px] tracking-[-0.42px]">
                  Book Now
                </span>
                <span className="text-white text-[16px] font-bold">
                  →
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllRatesOverlay;
