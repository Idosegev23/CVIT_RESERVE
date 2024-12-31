'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createClient } from '@supabase/supabase-js';
import CouponModal from '@/components/CouponModal';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// בדיקת חיבור לסופאבייס
console.log('Connecting to Supabase...');

export default function ReservistForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Phone: '',
    Email: '',
  });
  const [couponCode, setCouponCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Fetching available coupon...');
      
      // בדיקה פשוטה - נביא קופון אחד לבדיקה
      const { data, error } = await supabase
        .from('reservist_coupons')
        .select('*')
        .limit(1);

      console.log('Query response:', { data, error });

      if (error) {
        console.error('Error fetching coupons:', error);
        setError(t('form.error.general'));
        return;
      }

      if (!data || data.length === 0) {
        console.error('No coupons found in the table');
        setError('לא נמצאו קופונים במערכת');
        return;
      }

      // נמצא קופון פנוי
      const { data: availableCoupons, error: unusedError } = await supabase
        .from('reservist_coupons')
        .select('*')
        .is('FirstName', null)
        .limit(1);

      console.log('Available coupons:', availableCoupons);

      if (unusedError) {
        console.error('Error fetching available coupons:', unusedError);
        setError(t('form.error.general'));
        return;
      }

      if (!availableCoupons || availableCoupons.length === 0) {
        console.error('No available coupons found');
        setError('לא נמצאו קופונים פנויים במערכת');
        return;
      }

      const availableCoupon = availableCoupons[0];
      console.log('Found available coupon:', availableCoupon);

      // Update the coupon with user details
      const { error: updateError } = await supabase
        .from('reservist_coupons')
        .update({
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          Phone: formData.Phone,
          Email: formData.Email,
          updated_at: new Date().toISOString()
        })
        .eq('id', availableCoupon.id)
        .select();

      if (updateError) {
        console.error('Error updating coupon:', updateError);
        setError(t('form.error.general'));
        return;
      }

      setCouponCode(availableCoupon.code);
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
