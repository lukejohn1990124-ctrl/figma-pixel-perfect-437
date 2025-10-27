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

  const handleSubmit = () => {
    onSubmit({ checkIn, checkOut, adults, rooms, kids });
  };

  const CounterButton: React.FC<{
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    min?: number;
  }> = ({ label, value, onIncrement, onDecrement, min = 0 }) => (
    <div className="flex items-center gap-3">
      <span className="text-black text-[16px] font-normal min-w-[60px]">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrement}
          disabled={value <= min}
          className="flex items-center justify-center w-[32px] h-[32px] rounded-full border-2 border-black bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-black text-[20px] font-bold leading-none">−</span>
        </button>
        <span className="text-black text-[18px] font-bold min-w-[24px] text-center">{value}</span>
        <button
          type="button"
          onClick={onIncrement}
          className="flex items-center justify-center w-[32px] h-[32px] rounded-full border-2 border-black bg-white hover:bg-gray-50 transition-colors"
        >
          <span className="text-black text-[20px] font-bold leading-none">+</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="absolute left-5 right-5 bottom-[calc(100%+20px)] bg-white rounded-[20px] border-4 border-[#1D0FE5] shadow-lg z-50 p-5">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-6 flex-wrap max-md:flex-col max-md:items-stretch">
        <div className="flex items-center gap-4 max-md:flex-col max-md:items-stretch max-md:gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-2 px-4 py-2 border-2 border-black rounded-[100px] bg-white hover:bg-gray-50 transition-colors min-w-[180px]"
                )}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="text-black text-[14px] font-normal">
                  {format(checkIn, 'MMM dd, yyyy')}
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
                  "flex items-center gap-2 px-4 py-2 border-2 border-black rounded-[100px] bg-white hover:bg-gray-50 transition-colors min-w-[180px]"
                )}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="text-black text-[14px] font-normal">
                  {format(checkOut, 'MMM dd, yyyy')}
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
        </div>

        <div className="flex items-center gap-4 max-md:flex-col max-md:items-stretch max-md:gap-3">
          <CounterButton
            label="Adults"
            value={adults}
            onIncrement={() => setAdults(adults + 1)}
            onDecrement={() => setAdults(adults - 1)}
            min={1}
          />
          
          <CounterButton
            label="Rooms"
            value={rooms}
            onIncrement={() => setRooms(rooms + 1)}
            onDecrement={() => setRooms(rooms - 1)}
            min={1}
          />
          
          <CounterButton
            label="Kids"
            value={kids}
            onIncrement={() => setKids(kids + 1)}
            onDecrement={() => setKids(kids - 1)}
            min={0}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="ml-auto flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-[16px] font-bold rounded-[100px] hover:opacity-90 transition-opacity max-md:ml-0 max-md:w-full"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default DatePeopleOverlay;
