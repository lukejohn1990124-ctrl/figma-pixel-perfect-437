import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DatePeopleOverlay from './DatePeopleOverlay';
import CountryListOverlay from './CountryListOverlay';
import { format } from 'date-fns';

interface CountryOption {
  city: string;
  country: string;
}

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('Hotel in riga with coffee maker in the room with the cost of less than $500 a night');
  const [isLoading, setIsLoading] = useState(false);
  const [showDateOverlay, setShowDateOverlay] = useState(false);
  const [showCountryOverlay, setShowCountryOverlay] = useState(false);
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [pendingSearchQuery, setPendingSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleDatePeopleSubmit = (data: {
    checkIn: Date;
    checkOut: Date;
    adults: number;
    rooms: number;
    kids: number;
  }) => {
    const dateInfo = `from ${format(data.checkIn, 'MMMM dd, yyyy')} to ${format(data.checkOut, 'MMMM dd, yyyy')}, ${data.adults} adult${data.adults > 1 ? 's' : ''}, ${data.rooms} room${data.rooms > 1 ? 's' : ''}${data.kids > 0 ? `, ${data.kids} kid${data.kids > 1 ? 's' : ''}` : ''}`;
    
    const finalQuery = `${pendingSearchQuery || searchQuery}, ${dateInfo}`;
    setSearchQuery(finalQuery);
    setShowDateOverlay(false);
    proceedWithSearch(finalQuery);
  };

  const handleDateOverlayClose = () => {
    const defaultCheckIn = new Date();
    defaultCheckIn.setDate(defaultCheckIn.getDate() + 1);
    const defaultCheckOut = new Date(defaultCheckIn);
    defaultCheckOut.setDate(defaultCheckOut.getDate() + 3);
    
    const dateInfo = `from ${format(defaultCheckIn, 'MMMM dd, yyyy')} to ${format(defaultCheckOut, 'MMMM dd, yyyy')}, 1 adult, 1 room`;
    
    const finalQuery = `${pendingSearchQuery || searchQuery}, ${dateInfo}`;
    setSearchQuery(finalQuery);
    setShowDateOverlay(false);
    proceedWithSearch(finalQuery);
  };

  const handleCountrySelect = (option: CountryOption) => {
    const updatedQuery = searchQuery.replace(
      new RegExp(`\\b${option.city.split(' ')[0]}\\b`, 'gi'),
      `${option.city}, ${option.country}`
    );
    setSearchQuery(updatedQuery);
    setShowCountryOverlay(false);
    setCountryOptions([]);
  };

  const checkForCountrySuggestions = async (query: string) => {
    if (!query.trim()) {
      setShowCountryOverlay(false);
      setCountryOptions([]);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('search-hotels', {
        body: { query }
      });

      if (error) throw error;

      if (data.needsCountrySelection && data.countryOptions) {
        setCountryOptions(data.countryOptions);
        setShowCountryOverlay(true);
      } else {
        setShowCountryOverlay(false);
        setCountryOptions([]);
      }
    } catch (error) {
      console.error('Error checking countries:', error);
    }
  };

  const handleQueryChange = (value: string) => {
    setSearchQuery(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      checkForCountrySuggestions(value);
    }, 500);
  };

  const proceedWithSearch = async (finalQuery: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('search-hotels', {
        body: { query: finalQuery }
      });

      if (error) throw error;

      if (data.needsDateInfo) {
        setPendingSearchQuery(finalQuery);
        setShowDateOverlay(true);
        setIsLoading(false);
        return;
      }

      navigate('/search-results', { state: { results: data.hotels, query: finalQuery } });
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setShowCountryOverlay(false);
    await proceedWithSearch(searchQuery);
  };

  return (
    <section className="flex flex-col items-center self-stretch pt-[54px] pb-[134px] px-[272px] max-md:pt-10 max-md:pb-[100px] max-md:px-[150px] max-sm:pt-[30px] max-sm:pb-[60px] max-sm:px-5">
      <div ref={formRef} className="relative flex flex-col items-start gap-2.5 shadow-[0_0_27.8px_9px_rgba(62,146,204,0.50)] p-[3px] rounded-[16.4px] max-sm:w-full">
        <form onSubmit={handleSearch} className="flex w-[750px] h-[300px] flex-col justify-center items-center gap-3 bg-white p-6 rounded-[16.4px] border-4 border-solid border-[#1D0FE5] max-md:w-[600px] max-md:h-[250px] max-sm:w-full max-sm:h-[200px] max-sm:p-4">
          <div className="flex flex-col justify-center items-end gap-2.5 flex-[1_0_0] self-stretch">
            <label htmlFor="hotel-search" className="sr-only">
              Describe your ideal hotel
            </label>
            <textarea
              id="hotel-search"
              value={searchQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
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

        {showDateOverlay && (
          <DatePeopleOverlay
            onSubmit={handleDatePeopleSubmit}
            onClose={handleDateOverlayClose}
          />
        )}

        {showCountryOverlay && (
          <CountryListOverlay
            options={countryOptions}
            onSelect={handleCountrySelect}
          />
        )}
      </div>
    </section>
  );
};

export default SearchSection;
