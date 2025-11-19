import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import SignUpOverlay from './SignUpOverlay';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="flex w-full flex-col items-start shrink-0 px-[60px] py-[15px] max-md:px-10 max-md:py-3 max-sm:px-5 max-sm:py-[10px]">
      <div className="flex w-full max-w-[1160px] items-center gap-[100px] bg-white mx-auto my-0 px-[30px] py-0 rounded-[30px] max-md:gap-[50px] max-md:px-5 max-md:py-0 max-sm:flex-row max-sm:justify-between max-sm:gap-5 max-sm:px-[15px] max-sm:py-0">
        <div className="text-black text-[45px] font-black leading-[49.5px] tracking-[-1.35px] max-md:text-[35px] max-sm:text-[28px]">
          pakkd
        </div>
        
        <nav className="flex justify-center items-center gap-[35px] px-0 py-[15px] max-md:gap-[25px] max-sm:hidden">
          <a 
            href="#about" 
            className="text-black text-[18px] font-normal leading-[20px] tracking-[-0.54px] cursor-pointer hover:opacity-80 transition-opacity max-md:text-base"
          >
            About Us
          </a>
          <a 
            href="#deals" 
            className="text-black text-[18px] font-normal leading-[20px] tracking-[-0.54px] cursor-pointer hover:opacity-80 transition-opacity max-md:text-base"
          >
            All Hotel Deals
          </a>
          <a 
            href="#refer" 
            className="text-black text-[18px] font-normal leading-[20px] tracking-[-0.54px] cursor-pointer hover:opacity-80 transition-opacity max-md:text-base"
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

        <div className="flex w-[280px] justify-end items-center gap-[18px] shrink-0 max-md:w-[220px] max-md:gap-[12px] max-sm:w-auto max-sm:gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-black text-[16px] font-normal max-md:text-sm max-sm:hidden">
                {user.email}
              </span>
              <button 
                onClick={signOut}
                className="text-black text-[18px] font-bold leading-[20px] tracking-[-0.54px] cursor-pointer hover:opacity-80 transition-opacity max-md:text-base"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setIsSignUpOpen(true)}
                className="text-black text-[18px] font-bold leading-[20px] tracking-[-0.54px] cursor-pointer hover:opacity-80 transition-opacity max-md:text-base"
              >
                Log In
              </button>
              <button 
                onClick={() => setIsSignUpOpen(true)}
                className="flex w-[130px] h-[42px] justify-center items-center shrink-0 cursor-pointer bg-[#160C87] px-2 py-[3px] rounded-[100px] hover:bg-[#1a0f9a] transition-colors max-md:w-[110px] max-md:h-[36px] max-sm:w-[100px] max-sm:h-[34px]"
              >
                <span className="text-white text-[18px] font-bold leading-[20px] tracking-[-0.54px] max-md:text-base max-sm:text-sm">
                  Sign Up
                </span>
              </button>
            </>
          )}
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

      <SignUpOverlay open={isSignUpOpen} onOpenChange={setIsSignUpOpen} />
    </header>
  );
};

export default Header;
