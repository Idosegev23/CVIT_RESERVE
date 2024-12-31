# CVIT Reservist Coupon System

מערכת חלוקת קופונים למילואימניקים - CVIT

## התקנה

1. התקן את הפרויקט:
```bash
git clone https://github.com/Idosegev23/CVIT_RESERVE.git
cd CVIT_RESERVE
npm install
```

2. צור קובץ `.env.local` והוסף את המשתנים הבאים:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ZOHO_MAIL_USER=your_zoho_mail
ZOHO_MAIL_PASS=your_zoho_password
NEXT_PUBLIC_APP_URL=your_app_url
```

3. הפעל את הפרויקט:
```bash
npm run dev
```

## תכונות

- טופס הרשמה דו-לשוני (עברית ואנגלית)
- חלוקת קופונים אוטומטית
- שליחת קופון במייל
- ממשק משתמש מותאם למובייל
- עיצוב מודרני ונגיש

## טכנולוגיות

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- i18next
- Zoho Mail

## מבנה הפרויקט

```
/
├── app/                    # Next.js app router
├── components/            # React components
├── i18n/                  # Translations
├── public/               # Static files
└── styles/              # Global styles
```

## הערות

- יש לוודא שיש חיבור תקין ל-Supabase
- נדרשת הגדרת חשבון Zoho Mail לשליחת מיילים
- הפרויקט תומך ב-RTL ו-LTR
