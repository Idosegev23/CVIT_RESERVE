'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createClient } from '@supabase/supabase-js';
import CouponModal from '@/components/CouponModal';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ReservistForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Phone: '',
    Email: '',
  });
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  const generateCouponCode = () => {
    // יצירת קוד קופון אקראי בפורמט XXXX-XXXX-XXXX
    return `${uuidv4().slice(0, 4)}-${uuidv4().slice(0, 4)}-${uuidv4().slice(0, 4)}`.toUpperCase();
  };

  const verifyMilitaryCertificate = async (imageUrl: string) => {
    try {
      const response = await fetch('/api/verify-certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          firstName: formData.FirstName,
          lastName: formData.LastName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify certificate');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verifying certificate:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!certificateFile) {
        setError(t('form.error.noCertificate'));
        return;
      }

      // העלאת הקובץ לסופאבייס
      const fileExt = certificateFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('reserve')
        .upload(fileName, certificateFile);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        setError(t('form.error.uploadFailed'));
        return;
      }

      // קבלת URL לקובץ
      const { data: { publicUrl } } = supabase.storage
        .from('reserve')
        .getPublicUrl(fileName);

      // אימות התעודה
      const verificationResult = await verifyMilitaryCertificate(publicUrl);
      
      if (!verificationResult.isValid) {
        setError(t('form.error.invalidCertificate'));
        return;
      }

      // יצירת קוד קופון
      const newCouponCode = generateCouponCode();
      setCouponCode(newCouponCode);

      // שמירת פרטי המשתמש בטבלת reservist_coupons
      const { error: insertError } = await supabase
        .from('reservist_coupons')
        .insert({
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          Phone: formData.Phone,
          Email: formData.Email,
          coupon_code: newCouponCode,
          military_certificate_url: publicUrl,
          is_verified: true,
          military_days: verificationResult.militaryDays,
          verification_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error saving user details:', insertError);
        setError(t('form.error.general'));
        return;
      }

      setIsModalOpen(true);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(t('form.error.general'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label htmlFor="FirstName" className="block text-sm font-medium text-dark">
              {t('form.firstName')}
            </label>
            <input
              type="text"
              id="FirstName"
              required
              className="form-input"
              value={formData.FirstName}
              onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="LastName" className="block text-sm font-medium text-dark">
              {t('form.lastName')}
            </label>
            <input
              type="text"
              id="LastName"
              required
              className="form-input"
              value={formData.LastName}
              onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="Phone" className="block text-sm font-medium text-dark">
              {t('form.phone')}
            </label>
            <input
              type="tel"
              id="Phone"
              required
              pattern="^0[0-9]{8,9}$"
              title="מספר טלפון ישראלי תקין"
              className="form-input"
              value={formData.Phone}
              onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="Email" className="block text-sm font-medium text-dark">
              {t('form.email')}
            </label>
            <input
              type="email"
              id="Email"
              required
              className="form-input"
              value={formData.Email}
              onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="certificate" className="block text-sm font-medium text-dark">
              {t('form.certificate')}
            </label>
            <input
              type="file"
              id="certificate"
              required
              accept="image/*,.pdf"
              className="form-input w-full"
              onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
            />
            <p className="text-sm text-gray-500 mt-1">
              {t('form.certificateHelp')}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('loading')}
              </span>
            ) : (
              t('form.submit')
            )}
          </button>
        </div>
      </form>

      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        couponCode={couponCode}
        email={formData.Email}
      />
    </div>
  );
} 
