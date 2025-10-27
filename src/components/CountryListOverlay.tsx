import React from 'react';

interface CountryOption {
  city: string;
  country: string;
}

interface CountryListOverlayProps {
  options: CountryOption[];
  onSelect: (option: CountryOption) => void;
}

const CountryListOverlay: React.FC<CountryListOverlayProps> = ({ options, onSelect }) => {
  return (
    <div className="absolute left-0 right-0 bottom-[calc(100%+20px)] bg-white rounded-[50px] border-4 border-[#1D0FE5] shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden z-[100] max-sm:left-0 max-sm:right-0">
      <div className="px-6 py-4 max-sm:px-4">
        <div className="flex gap-3 flex-wrap justify-start max-sm:gap-2">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelect(option)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-black rounded-[100px] hover:bg-gray-50 transition-colors bg-white max-sm:px-4 max-sm:py-2"
            >
              <span className="text-black text-[20px] font-bold max-sm:text-[16px]">
                {option.city}
              </span>
              <span className="text-black text-[16px] font-normal max-sm:text-[14px]">
                {option.country}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountryListOverlay;
