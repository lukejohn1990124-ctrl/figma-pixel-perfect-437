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
    <div className="absolute left-[20px] right-[180px] bottom-[20px] bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.16)] z-[100] max-md:right-[160px] max-sm:right-[140px]">
      <div className="px-6 py-4 overflow-x-auto max-sm:px-4">
        <div className="flex gap-3 justify-start max-sm:gap-2">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelect(option)}
              className="flex items-center gap-2 px-6 py-3 border border-black rounded-[100px] hover:bg-gray-50 transition-colors bg-white whitespace-nowrap max-sm:px-4 max-sm:py-2"
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
