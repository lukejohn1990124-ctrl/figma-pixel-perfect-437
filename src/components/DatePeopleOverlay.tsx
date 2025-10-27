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
  defaultCheckOut.setDate(defaultCheckOut.getDate() + 3);

  const [checkIn, setCheckIn] = useState<Date>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<Date>(defaultCheckOut);
  const [adults, setAdults] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [kids, setKids] = useState(0);

  const summaryText = `${format(checkIn, 'EEEE, MMM dd')} - ${format(checkOut, 'EEEE, MMM dd')}, ${adults} adult${adults > 1 ? 's' : ''}, ${rooms} room${rooms > 1 ? 's' : ''}${kids > 0 ? `, ${kids} kid${kids > 1 ? 's' : ''}` : ''}`;

  const handleSubmit = () => {
    onSubmit({ checkIn, checkOut, adults, rooms, kids });
  };

  return (
    <div className="absolute left-5 right-5 bottom-[calc(100%+20px)] bg-white rounded-[20px] border-4 border-[#1D0FE5] shadow-lg z-50 p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-black text-[20px] font-semibold">Set your own date or use our default date</h3>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-4"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-gray-200 rounded-[50px] px-6 py-4 mb-6">
        <p className="text-gray-700 text-[16px]">{summaryText}</p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-start gap-1 px-6 py-3 border-2 border-black rounded-[100px] bg-white hover:bg-gray-50 transition-colors min-w-[200px]"
              )}
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                <span className="text-black text-[14px] font-normal">Check In</span>
              </div>
              <span className="text-black text-[18px] font-bold pl-7">
                {format(checkIn, 'EEEE, MMM dd')}
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
                "flex flex-col items-start gap-1 px-6 py-3 border-2 border-black rounded-[100px] bg-white hover:bg-gray-50 transition-colors min-w-[200px]"
              )}
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                <span className="text-black text-[14px] font-normal">Check Out</span>
              </div>
              <span className="text-black text-[18px] font-bold pl-7">
                {format(checkOut, 'EEEE, MMM dd')}
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

        <div className="flex items-center gap-2 px-6 py-3 border-2 border-black rounded-[100px] bg-white">
          <span className="text-black text-[16px] font-normal">Adults</span>
          <button
            type="button"
            onClick={() => setAdults(Math.max(1, adults - 1))}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <span className="text-[20px] font-bold leading-none">−</span>
          </button>
          <span className="text-black text-[20px] font-bold min-w-[24px] text-center">{adults}</span>
          <button
            type="button"
            onClick={() => setAdults(adults + 1)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <span className="text-[20px] font-bold leading-none">+</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap mt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-6 py-3 border-2 border-black rounded-[100px] bg-white">
            <span className="text-black text-[16px] font-normal">Rooms</span>
            <button
              type="button"
              onClick={() => setRooms(Math.max(1, rooms - 1))}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <span className="text-[20px] font-bold leading-none">−</span>
            </button>
            <span className="text-black text-[20px] font-bold min-w-[24px] text-center">{rooms}</span>
            <button
              type="button"
              onClick={() => setRooms(rooms + 1)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <span className="text-[20px] font-bold leading-none">+</span>
            </button>
          </div>

          <div className="flex items-center gap-2 px-6 py-3 border-2 border-black rounded-[100px] bg-white">
            <span className="text-black text-[16px] font-normal">Kids</span>
            <button
              type="button"
              onClick={() => setKids(Math.max(0, kids - 1))}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <span className="text-[20px] font-bold leading-none">−</span>
            </button>
            <span className="text-black text-[20px] font-bold min-w-[24px] text-center">{kids}</span>
            <button
              type="button"
              onClick={() => setKids(kids + 1)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <span className="text-[20px] font-bold leading-none">+</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center justify-center px-10 py-4 bg-gradient-to-r from-[#1D4ED8] to-[#A855F7] text-white text-[18px] font-semibold rounded-[100px] hover:opacity-90 transition-opacity"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default DatePeopleOverlay;
