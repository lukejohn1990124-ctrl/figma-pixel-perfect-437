import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { X } from 'lucide-react';
import { format } from 'date-fns';

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
  const defaultCheckOut = new Date();
  defaultCheckOut.setDate(defaultCheckOut.getDate() + 4);

  const [checkIn, setCheckIn] = useState<Date>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<Date>(defaultCheckOut);
  const [adults, setAdults] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [kids, setKids] = useState(0);

  const handleSubmit = () => {
    onSubmit({ checkIn, checkOut, adults, rooms, kids });
  };

  return (
    <div className="absolute left-5 right-5 bottom-[calc(100%+20px)] bg-white rounded-[20px] border-4 border-[#1D0FE5] shadow-lg overflow-hidden z-50 max-h-[calc(100vh-200px)]">
      <div className="relative p-6 overflow-y-auto max-h-[500px]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-black text-[24px] font-bold mb-6">
          Set your own date or use our default date
        </h2>

        <div className="mb-6 p-4 bg-gray-200 rounded-[10px]">
          <p className="text-black text-[18px]">
            {format(checkIn, 'EEEE, MMM dd')} - {format(checkOut, 'EEEE, MMM dd')}, {adults} adults, {rooms} room{rooms > 1 ? 's' : ''}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px]">
              <div className="flex items-center gap-3 p-4 border-2 border-black rounded-[20px]">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <div>
                  <div className="text-[14px] text-gray-600">Check In</div>
                  <div className="text-[18px] font-bold">{format(checkIn, 'EEEE, MMM dd')}</div>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={(date) => date && setCheckIn(date)}
                className="mt-2 bg-white border-2 border-gray-300 rounded-lg"
                disabled={(date) => date < new Date()}
              />
            </div>

            <div className="flex-1 min-w-[250px]">
              <div className="flex items-center gap-3 p-4 border-2 border-black rounded-[20px]">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <div>
                  <div className="text-[14px] text-gray-600">Check Out</div>
                  <div className="text-[18px] font-bold">{format(checkOut, 'EEEE, MMM dd')}</div>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={(date) => date && setCheckOut(date)}
                className="mt-2 bg-white border-2 border-gray-300 rounded-lg"
                disabled={(date) => date <= checkIn}
              />
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-3 p-4 border-2 border-black rounded-[20px] flex-1 min-w-[200px]">
              <span className="text-[18px] font-medium">Adults</span>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-[24px] font-bold hover:bg-gray-800"
                >
                  −
                </button>
                <span className="text-[24px] font-bold w-8 text-center">{adults}</span>
                <button
                  onClick={() => setAdults(adults + 1)}
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-[24px] font-bold hover:bg-gray-800"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border-2 border-black rounded-[20px] flex-1 min-w-[200px]">
              <span className="text-[18px] font-medium">Rooms</span>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={() => setRooms(Math.max(1, rooms - 1))}
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-[24px] font-bold hover:bg-gray-800"
                >
                  −
                </button>
                <span className="text-[24px] font-bold w-8 text-center">{rooms}</span>
                <button
                  onClick={() => setRooms(rooms + 1)}
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-[24px] font-bold hover:bg-gray-800"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border-2 border-black rounded-[20px] flex-1 min-w-[200px]">
              <span className="text-[18px] font-medium">Kids</span>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={() => setKids(Math.max(0, kids - 1))}
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-[24px] font-bold hover:bg-gray-800"
                >
                  −
                </button>
                <span className="text-[24px] font-bold w-8 text-center">{kids}</span>
                <button
                  onClick={() => setKids(kids + 1)}
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-[24px] font-bold hover:bg-gray-800"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-gradient-to-r from-[#2F0FCE] to-[#8B5CF6] text-white text-[20px] font-bold py-4 rounded-[10px] hover:opacity-90 transition-opacity"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default DatePeopleOverlay;
