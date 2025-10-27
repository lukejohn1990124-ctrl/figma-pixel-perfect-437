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
    <div className="absolute left-5 right-5 bottom-[calc(100%+20px)] bg-white rounded-[50px] border-4 border-[#1D0FE5] shadow-lg overflow-hidden z-50">
      <div className="px-6 py-4">
        <div className="flex gap-3 flex-wrap justify-start">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelect(option)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-black rounded-[100px] hover:bg-gray-50 transition-colors bg-white"
            >
              <span className="text-black text-[20px] font-bold">
                {option.city}
              </span>
              <span className="text-black text-[16px] font-normal">
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
