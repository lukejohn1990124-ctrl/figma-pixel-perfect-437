import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePeopleOverlayProps {
  onSubmit: (data: {
    checkIn: Date;
    checkOut: Date;
    adults: number;
    rooms: number;
    kids: number;
  }) => void;
  onClose: () => void;
}

const DatePeopleOverlay: React.FC<DatePeopleOverlayProps> = ({ onSubmit, onClose }) => {
  const defaultCheckIn = new Date();
  defaultCheckIn.setDate(defaultCheckIn.getDate() + 1);
  const defaultCheckOut = new Date(defaultCheckIn);
  defaultCheckOut.setDate(defaultCheckOut.getDate() + 2);

  const [checkIn, setCheckIn] = useState<Date>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<Date>(defaultCheckOut);
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [kids, setKids] = useState(0);

  const summaryText = `${format(checkIn, 'EEEE, MMM dd')} - ${format(checkOut, 'EEEE, MMM dd')}, ${adults} adult${adults > 1 ? 's' : ''}, ${rooms} room${rooms > 1 ? 's' : ''}${kids > 0 ? `, ${kids} kid${kids > 1 ? 's' : ''}` : ''}`;

  const handleSubmit = () => {
    onSubmit({ checkIn, checkOut, adults, rooms, kids });
  };

  return (
    <div className="absolute left-[20px] top-[20px] right-[180px] bottom-[20px] bg-white rounded-[16px] border border-black shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-[100] p-4 max-md:right-[160px] max-sm:right-[140px] max-sm:p-3 overflow-y-auto">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-black text-[16px] font-semibold max-sm:text-[14px]">Set your own date or use our default date</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-2"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-gray-100 rounded-[50px] px-4 py-2 mb-3 max-sm:px-3 max-sm:py-2">
        <p className="text-gray-700 text-[13px] max-sm:text-[12px]">{summaryText}</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap max-sm:gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-start gap-0.5 px-4 py-2 border border-black rounded-[100px] bg-white hover:bg-gray-50 transition-colors min-w-[160px]"
              )}
            >
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4" />
                <span className="text-black text-[12px] font-normal">Check In</span>
              </div>
              <span className="text-black text-[14px] font-bold pl-5">
                {format(checkIn, 'EEE, MMM dd')}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={(date) => date && setCheckIn(date)}
              initialFocus
              disabled={(date) => date < new Date()}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-start gap-0.5 px-4 py-2 border border-black rounded-[100px] bg-white hover:bg-gray-50 transition-colors min-w-[160px]"
              )}
            >
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4" />
                <span className="text-black text-[12px] font-normal">Check Out</span>
              </div>
              <span className="text-black text-[14px] font-bold pl-5">
                {format(checkOut, 'EEE, MMM dd')}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={(date) => date && setCheckOut(date)}
              initialFocus
              disabled={(date) => date <= checkIn}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2 px-4 py-2 border border-black rounded-[100px] bg-white">
          <span className="text-black text-[13px] font-normal">Adults</span>
          <button
            type="button"
            onClick={() => setAdults(Math.max(1, adults - 1))}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <span className="text-[16px] font-bold leading-none">−</span>
          </button>
          <span className="text-black text-[16px] font-bold min-w-[20px] text-center">{adults}</span>
          <button
            type="button"
            onClick={() => setAdults(adults + 1)}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <span className="text-[16px] font-bold leading-none">+</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap mt-3 max-sm:flex-col max-sm:items-stretch">
        <div className="flex items-center gap-3 max-sm:gap-2 max-sm:flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 border border-black rounded-[100px] bg-white max-sm:px-3 max-sm:py-1.5">
            <span className="text-black text-[13px] font-normal">Rooms</span>
            <button
              type="button"
              onClick={() => setRooms(Math.max(1, rooms - 1))}
              className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <span className="text-[16px] font-bold leading-none">−</span>
            </button>
            <span className="text-black text-[16px] font-bold min-w-[20px] text-center">{rooms}</span>
            <button
              type="button"
              onClick={() => setRooms(rooms + 1)}
              className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <span className="text-[16px] font-bold leading-none">+</span>
            </button>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 border border-black rounded-[100px] bg-white max-sm:px-3 max-sm:py-1.5">
            <span className="text-black text-[13px] font-normal max-sm:text-[12px]">Kids</span>
            <button
              type="button"
              onClick={() => setKids(Math.max(0, kids - 1))}
              className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <span className="text-[16px] font-bold leading-none">−</span>
            </button>
            <span className="text-black text-[16px] font-bold min-w-[20px] text-center">{kids}</span>
            <button
              type="button"
              onClick={() => setKids(kids + 1)}
              className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <span className="text-[16px] font-bold leading-none">+</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center justify-center px-8 py-3 bg-black text-white text-[15px] font-semibold rounded-[100px] hover:bg-gray-800 transition-colors max-sm:w-full max-sm:px-6 max-sm:py-2.5 max-sm:text-[14px]"
        >
          Set
        </button>
      </div>
    </div>
  );
};

export default DatePeopleOverlay;
