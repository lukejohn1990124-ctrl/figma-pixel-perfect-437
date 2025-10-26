import React, { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="flex w-full flex-col items-start shrink-0 px-[60px] py-[25px] max-md:px-10 max-md:py-5 max-sm:px-5 max-sm:py-[15px]">
      <div className="flex w-full max-w-[1160px] items-center gap-[100px] bg-white mx-auto my-0 px-[30px] py-0 rounded-[30px] max-md:gap-[50px] max-md:px-5 max-md:py-0 max-sm:flex-row max-sm:justify-between max-sm:gap-5 max-sm:px-[15px] max-sm:py-0">
        <div className="text-black text-[45px] font-black leading-[49.5px] tracking-[-1.35px] max-md:text-[35px] max-sm:text-[28px]">
          pakkd
        </div>
        
        <nav className="flex justify-center items-center gap-[45px] px-0 py-[27px] max-md:gap-[30px] max-sm:hidden">
          <a 
            href="#about" 
            className="text-black text-[25px] font-normal leading-[27.5px] tracking-[-0.75px] cursor-pointer hover:opacity-80 transition-opacity max-md:text-xl"
          >
            About Us
          </a>
          <a 
            href="#deals" 
            className="text-black text-[25px] font-normal leading-[27.5px] tracking-[-0.75px] cursor-pointer hover:opacity-80 transition-opacity max-md:text-xl"
          >
            All Hotel Deals
          </a>
          <a 
            href="#refer" 
            className="text-black text-[25px] font-normal leading-[27.5px] tracking-[-0.75px] cursor-pointer hover:opacity-80 transition-opacity max-md:text-xl"
          >
            Refer & Earn
          </a>
        </nav>

        <button 
          className="hidden text-black text-3xl cursor-pointer max-sm:block"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <i className="ti ti-menu-2" />
        </button>

        <div className="flex w-[314px] justify-end items-center gap-[23px] shrink-0 max-md:w-[250px] max-md:gap-[15px] max-sm:w-auto max-sm:gap-2.5">
          <button className="text-black text-[25px] font-bold leading-[27.5px] tracking-[-0.75px] cursor-pointer hover:opacity-80 transition-opacity max-md:text-xl">
            Log In
          </button>
          <button className="flex w-[165px] h-[54px] justify-center items-center shrink-0 cursor-pointer bg-[#160C87] px-2 py-[3px] rounded-[100px] hover:bg-[#1a0f9a] transition-colors max-md:w-[140px] max-md:h-[45px] max-sm:w-[120px] max-sm:h-10">
            <span className="text-white text-[25px] font-bold leading-[27.5px] tracking-[-0.75px] max-md:text-xl max-sm:text-lg">
              Sign Up
            </span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden w-full bg-white mt-4 rounded-[20px] p-4 shadow-lg">
          <nav className="flex flex-col gap-4">
            <a href="#about" className="text-black text-xl font-normal hover:opacity-80 transition-opacity">
              About Us
            </a>
            <a href="#deals" className="text-black text-xl font-normal hover:opacity-80 transition-opacity">
              All Hotel Deals
            </a>
            <a href="#refer" className="text-black text-xl font-normal hover:opacity-80 transition-opacity">
              Refer & Earn
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
