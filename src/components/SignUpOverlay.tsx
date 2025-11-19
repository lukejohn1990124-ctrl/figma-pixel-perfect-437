import React from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface SignUpOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SignUpOverlay = ({ open, onOpenChange }: SignUpOverlayProps) => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] p-0 bg-white border-2 border-black rounded-[20px] max-h-[90vh] overflow-y-auto">
        <div className="relative p-8">
          <DialogClose className="absolute right-6 top-6 text-black text-2xl hover:opacity-70 transition-opacity">
            ×
          </DialogClose>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-black text-[28px] font-bold leading-[32px] tracking-[-0.84px] mb-2">
              Hi there traveller.
            </h2>
            <p className="text-black text-[18px] font-normal leading-[22px] tracking-[-0.54px]">
              Sign in to get access to our benefits.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-3 gap-6 mb-8 max-md:grid-cols-1">
            {/* Cashback Benefit */}
            <div className="flex flex-col items-center text-center">
              <div className="w-[60px] h-[60px] bg-[#160C87] rounded-full flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <p className="text-black text-[14px] font-normal leading-[18px] tracking-[-0.42px]">
                Get cashback on all hotels listed on our website and get points to redeem for cash and other rewards
              </p>
            </div>

            {/* Email Updates Benefit */}
            <div className="flex flex-col items-center text-center">
              <div className="w-[60px] h-[60px] bg-[#160C87] rounded-full flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </div>
              <p className="text-black text-[14px] font-normal leading-[18px] tracking-[-0.42px]">
                Stay in the know about deals, discounts, set price alerts and new website features
              </p>
            </div>

            {/* Referral Benefit */}
            <div className="flex flex-col items-center text-center">
              <div className="w-[60px] h-[60px] bg-[#160C87] rounded-full flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="text-black text-[14px] font-normal leading-[18px] tracking-[-0.42px]">
                Participate in our refer-a-friend program where you and the friend you refer get 300 points
              </p>
            </div>
          </div>

          {/* Sign-in Options */}
          <div className="max-w-[400px] mx-auto">
            {/* Continue with Email Button */}
            <Button
              variant="outline"
              className="w-full h-[50px] bg-white text-black border-2 border-black rounded-[100px] text-[16px] font-bold hover:bg-gray-50 mb-4"
            >
              Continue with email
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-gray-500 text-[14px]">or</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Google Sign-in Button */}
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-[50px] bg-white text-black border-2 border-black rounded-[100px] text-[16px] font-bold hover:bg-gray-50 mb-3 flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>

            {/* Apple Sign-in Button */}
            <Button
              variant="outline"
              className="w-full h-[50px] bg-black text-white border-2 border-black rounded-[100px] text-[16px] font-bold hover:bg-gray-900 flex items-center justify-center gap-3"
              disabled
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </Button>
          </div>

          {/* Footer Legal Text */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-[11px] leading-[14px]">
              By continuing, you agree to pakkd's{' '}
              <a href="#" className="text-[#160C87] underline">Terms of Use</a> and{' '}
              <a href="#" className="text-[#160C87] underline">Privacy Policy</a>.
            </p>
            <p className="text-gray-600 text-[11px] leading-[14px] mt-2">
              This site is protected by reCAPTCHA and the Google{' '}
              <a href="#" className="text-[#160C87] underline">Privacy Policy</a> and{' '}
              <a href="#" className="text-[#160C87] underline">Terms of Service</a> apply.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpOverlay;