import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import SearchSection from '@/components/SearchSection';
import HotelDealsSection from '@/components/HotelDealsSection';

const Index = () => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Inria+Sans:wght@400;700&display=swap"
      />
      <div className="flex w-full min-h-screen flex-col items-start bg-[#071D5A] pb-[138px]">
        <Header />
        
        <main className="flex flex-col w-full">
          <HeroSection />
          <SearchSection />
          <HotelDealsSection />
        </main>
      </div>
    </>
  );
};

export default Index;
