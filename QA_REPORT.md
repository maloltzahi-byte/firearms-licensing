# דוח QA ותוכנית המשך

## מה נבדק בקוד
- השאלון שומר רשומה ל-`client_submissions`.
- הדשבורד טוען רשומות מ-`client_submissions`, מציג סטטוסים ומאפשר עדכון.
- הדשבורד פותח את `engine.html` עם `submission_id` עבור ליד קיים.
- מנוע ההחלטה יודע לטעון `submission_id`, למלא שדות אוטומטית, להריץ החלטה ולעדכן את אותה רשומה.
- שלושת הקבצים עובדים כעת מול `app.config.js` אחד, כדי שלא תצטרך לעדכן URL/Key בשלושה מקומות.

## מה עדיין דורש בדיקה חיה
1. שאלון -> יצירת ליד חדש ב-Supabase.
2. דשבורד -> הופעת הליד החדש בטבלה.
3. דשבורד -> פתיחת מנוע מהכרטיס של אותו ליד.
4. מנוע -> עדכון הרשומה הקיימת במקום יצירת ליד כפול.
5. אד"מ -> שמירת הערה ושינוי סטטוס ל-`IN_PROCESS`.

## קבצי מאסטר חדשים
- index_final.html
- dashboard_final.html
- engine_final.html
- app.config.js

## סדר העלאה נכון
1. app.config.js
2. index.html (להחליף ב-index_final.html)
3. dashboard.html (להחליף ב-dashboard_final.html)
4. engine.html (להחליף ב-engine_final.html)

## הערת אבטחה
מפתח Supabase כאן הוא `anon/publishable` ולא `service_role`, ולכן הוא מיועד לצד לקוח. ההגנה האמיתית חייבת להיות ב-RLS של Supabase. לעומת זאת, GitHub token שנחשף חייב להימחק מיידית.
