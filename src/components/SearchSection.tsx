import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('Hotel in riga with coffee maker in the room with the cost of less than $500 a night');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('search-hotels', {
        body: { query: searchQuery }
      });

      if (error) throw error;

      navigate('/search-results', { state: { results: data.hotels, query: searchQuery } });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Search failed',
        description: 'Unable to search for hotels. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center self-stretch pt-[54px] pb-[134px] px-[272px] max-md:pt-10 max-md:pb-[100px] max-md:px-[150px] max-sm:pt-[30px] max-sm:pb-[60px] max-sm:px-5">
      <div className="flex flex-col items-start gap-2.5 shadow-[0_0_27.8px_9px_rgba(62,146,204,0.50)] p-[3px] rounded-[16.4px] max-sm:w-full">
        <form onSubmit={handleSearch} className="flex w-[750px] h-[300px] flex-col justify-center items-center gap-3 bg-white p-6 rounded-[16.4px] border-4 border-solid border-[#1D0FE5] max-md:w-[600px] max-md:h-[250px] max-sm:w-full max-sm:h-[200px] max-sm:p-4">
          <div className="flex flex-col justify-center items-end gap-2.5 flex-[1_0_0] self-stretch">
            <label htmlFor="hotel-search" className="sr-only">
              Describe your ideal hotel
            </label>
            <textarea
              id="hotel-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe your ideal hotel..."
              className="flex-[1_0_0] self-stretch text-black text-base font-normal leading-6 tracking-[-0.312px] resize-none border-none outline-none bg-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="flex justify-center items-center gap-2.5 cursor-pointer bg-[#155DFC] px-[23px] py-3 rounded-[10px] hover:bg-[#1348d4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-white text-base font-normal leading-6 tracking-[-0.312px]">
                {isLoading ? 'Searching...' : 'Search Hotels'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchSection;
