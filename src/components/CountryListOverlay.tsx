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
    <div className="absolute left-5 right-5 bottom-[calc(100%+20px)] bg-white rounded-[20px] border-4 border-[#1D0FE5] shadow-lg overflow-hidden z-50 max-h-[300px]">
      <div className="p-4 overflow-y-auto">
        <div className="flex gap-3 flex-wrap">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelect(option)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-black rounded-[100px] hover:bg-gray-100 transition-colors"
            >
              <span className="text-black text-[18px] font-bold">
                {option.city}
              </span>
              <span className="text-gray-600 text-[16px]">
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
