import React from 'react';

const HeroSection = () => {
  return (
    <section className="flex flex-col justify-center items-center gap-6 self-stretch px-[145px] py-0 max-md:px-20 max-md:py-0 max-sm:px-5 max-sm:py-0">
      <h1 className="self-stretch text-white text-center text-[70px] font-bold leading-[77px] tracking-[-2.1px] max-md:text-[50px] max-sm:text-[32px]">
        Find Your Ideal Hotel with Just a Few Words
      </h1>
      <p className="self-stretch text-white text-center text-[35px] font-bold leading-[38.5px] tracking-[-1.05px] max-md:text-[25px] max-sm:text-lg">
        Describe what amenities, star ratings, views and other hotel related
        information you are looking for and we'll try to find hotels that
        best meet that
      </p>
    </section>
  );
};

export default HeroSection;
