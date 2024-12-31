'use client';

import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import { ClipboardDocumentIcon, EnvelopeIcon, CheckIcon } from '@heroicons/react/24/outline';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponCode: string;
  email: string;
}

export default function CouponModal({ isOpen, onClose, couponCode, email }: CouponModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [isCopied, setIsCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          couponCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      setIsEmailSent(true);
      setTimeout(() => setIsEmailSent(false), 3000);
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 ${isRTL ? 'text-right' : 'text-left'} align-middle shadow-xl transition-all`}>
                <div className="relative">
                  <img 
                    src="https://res.cloudinary.com/dsoh3yteb/image/upload/v1732464729/1_i9skom.svg"
                    alt={t('decorationAlt')}
                    className={`absolute -top-4 ${isRTL ? '-right-4' : '-left-4'} w-8 h-8 opacity-50`}
                  />
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-dark mb-6"
                  >
                    {t('modal.title')}
                  </Dialog.Title>
                </div>

                <div className="mt-4">
                  <p className="text-lg text-dark/80 mb-4">
                    {t('modal.description')}
                  </p>
                  <div className="mt-2 p-6 bg-light rounded-xl flex items-center justify-between">
                    <span className="font-mono text-2xl text-primary font-bold">{couponCode}</span>
                    <button
                      onClick={handleCopy}
                      className={`text-primary hover:text-secondary transition-colors p-2 rounded-lg hover:bg-white/50 ${isCopied ? 'text-green-500' : ''}`}
                      aria-label={t('modal.copyButton')}
                    >
                      {isCopied ? (
                        <CheckIcon className="h-6 w-6" />
                      ) : (
                        <ClipboardDocumentIcon className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <button
                    type="button"
                    disabled={isSending}
                    className={`inline-flex items-center px-4 py-2 text-base font-medium ${
                      isEmailSent ? 'text-green-500' : 'text-primary'
                    } hover:text-secondary transition-colors disabled:opacity-50`}
                    onClick={handleSendEmail}
                  >
                    {isSending ? (
                      <svg className={`animate-spin h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : isEmailSent ? (
                      <CheckIcon className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    ) : (
                      <EnvelopeIcon className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    )}
                    {isEmailSent ? t('modal.emailSent') : t('modal.emailButton')}
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-xl border border-transparent bg-primary px-6 py-3 text-base font-medium text-white hover:bg-secondary focus:outline-none transition-colors"
                    onClick={onClose}
                  >
                    {t('modal.closeButton')}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 