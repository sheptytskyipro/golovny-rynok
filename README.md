# 🍎 Головний Ринок

**Telegram Mini App — благодійний маркетплейс, де речі та послуги стають внеском у ЗСУ.**

Продовження проєкту [«Головний Герой»](https://t.me/golovnyiheroi) — об'єднання «Звітів» і «Народного ленд-лізу» фонду **Support Ukraine**.

> У кожного вже є все, щоб допомогти — треба лише дати ресурсам напрямок.

---

## Як це працює

1. Виставляєш річ або послугу
2. Інша людина купує через LiqPay
3. **100% вартості → ЗСУ** (прозоро і прослідковано)

---

## Стек і структура

```
golovny-rynok/
├── src/                    # Фронтенд (React + TypeScript + Vite)
│   ├── components/         # GlassCard, Layout, AppleLogo, ItemCard, ServiceCard
│   ├── hooks/              # useTelegram, useAuth
│   ├── pages/              # Home, Items, Services, Transparency, MySpace, About, FrontRear
│   ├── utils/              # liqpay.ts, novaPoshta.ts
│   └── types/              # TypeScript інтерфейси
├── server/                 # Бекенд (Express + TypeScript)
│   └── src/
│       ├── middleware/     # telegramAuth.ts (HMAC-SHA256)
│       ├── routes/         # auth, items, services, payments, novaPoshta, transparency
│       └── db/             # schema.sql (PostgreSQL)
├── .env.example            # Змінні фронтенду
├── server/.env.example     # Змінні бекенду
└── railway.json            # Конфіг деплою Railway
```

**Технології:**
- Фронтенд: React 18, TypeScript, Vite, Tailwind CSS (glassmorphism), Recharts
- Бекенд: Node.js, Express, TypeScript
- БД: PostgreSQL
- Auth: Telegram WebApp SDK (HMAC-SHA256 валідація)
- Платежі: LiqPay
- Доставка: Нова Пошта API

---

## Локальний запуск

### 0. Вимоги
- Node.js 18+
- npm 9+
- PostgreSQL (або акаунт на [Neon](https://neon.tech) / [Supabase](https://supabase.com))

### 1. Клонуй репозиторій
```bash
git clone https://github.com/sheptytskyipro/golovny-rynok.git
cd golovny-rynok
```

### 2. Налаштуй змінні середовища

**Фронтенд:**
```bash
cp .env.example .env
# Відредагуй .env — встав свої ключі
```

**Бекенд:**
```bash
cp server/.env.example server/.env
# Відредагуй server/.env — встав свої ключі
```

### 3. Підніми базу даних

**Варіант A — Neon (безкоштовно, рекомендовано):**
1. Зареєструйся на [neon.tech](https://neon.tech)
2. Створи новий проєкт
3. Скопіюй Connection String у `DATABASE_URL` в `server/.env`
4. Застосуй схему:
```bash
psql "$DATABASE_URL" -f server/src/db/schema.sql
```

**Варіант B — Supabase (безкоштовно):**
1. Зареєструйся на [supabase.com](https://supabase.com)
2. Створи проєкт → Settings → Database → Connection string (URI)
3. Скопіюй у `DATABASE_URL` в `server/.env`
4. У Supabase SQL Editor вставте і виконайте вміст `server/src/db/schema.sql`

**Варіант C — локальний PostgreSQL:**
```bash
createdb golovny_rynok
psql golovny_rynok -f server/src/db/schema.sql
# DATABASE_URL=postgresql://localhost:5432/golovny_rynok
```

### 4. Встанови залежності та запусти

```bash
# Термінал 1 — бекенд
cd server
npm install
npm run dev
# Сервер на http://localhost:3001

# Термінал 2 — фронтенд
cd ..   # повернись у корінь
npm install
npm run dev
# Застосунок на http://localhost:5173
```

---

## Як отримати ключі

### Telegram Bot Token
1. Відкрий Telegram → знайди **@BotFather**
2. Надішли `/newbot`
3. Введи назву: `Головний Ринок`
4. Введи username: `golovny_rynok_bot` (або будь-який вільний)
5. BotFather видасть токен виду `1234567890:ABCdef...`
6. Встав у `BOT_TOKEN` та `TELEGRAM_BOT_TOKEN` в `server/.env`

### LiqPay ключі
1. Зареєструйся на [liqpay.ua](https://www.liqpay.ua) як мерчант
2. Верифікуй акаунт (паспорт + ІПН або ЄДРПОУ)
3. Меню → **Бізнес** → **API** → розділ **Ключі**
4. Скопіюй `Публічний ключ` → `LIQPAY_PUBLIC_KEY` (і у фронт, і у бекенд)
5. Скопіюй `Приватний ключ` → `LIQPAY_PRIVATE_KEY` (**тільки бекенд!**)
6. Для тестування: використовуй sandbox-ключі зі [сторінки пісочниці](https://www.liqpay.ua/en/doc/sandbox)

### Нова Пошта API ключ
1. Зареєструйся на [novaposhta.ua](https://new.novaposhta.ua)
2. Профіль → **Налаштування** → **Безпека** → **Згенерувати API-ключ**
3. Скопіюй ключ → `NOVA_POSHTA_API_KEY`

### PostgreSQL (Neon — безкоштовно)
1. [neon.tech](https://neon.tech) → Sign Up → New Project
2. Назва: `golovny-rynok`
3. Region: Frankfurt (найближче)
4. Dashboard → **Connection Details** → **Connection string**
5. Скопіюй у `DATABASE_URL`

---

## Підключення Mini App у BotFather

```
1. Відкрий @BotFather у Telegram
2. Надішли /mybots → обери свого бота
3. Bot Settings → Menu Button → Configure menu button
4. Введи URL задеплоєного фронтенду (https://...)
5. Введи назву кнопки: "Головний Ринок"
```

Також можна через `/newapp`:
```
/newapp → обери бота → назва → опис → завантаж фото → введи URL фронтенду
```

---

## Деплой на безкоштовний хостинг

### Рекомендований варіант: Railway

Railway — найпростіший варіант: один сервіс для фронту, один для бекенду, один для PostgreSQL. HTTPS автоматично.

**Крок 1 — зареєструйся на [railway.app](https://railway.app)**

**Крок 2 — задеплой бекенд:**
```bash
# Встанови Railway CLI
npm install -g @railway/cli

# Логін
railway login

# У папці server/
cd server
railway init
railway up
```
У Railway Dashboard → Variables встав всі змінні з `server/.env.example`.

**Крок 3 — задеплой фронтенд (Vercel — безкоштовно):**
```bash
npm install -g vercel
vercel
# Vercel автоматично визначить Vite-проєкт
```
У Vercel Dashboard → Settings → Environment Variables встав змінні з `.env.example`.
У `VITE_API_URL` встав URL бекенду з Railway.

**Крок 4 — підключи PostgreSQL у Railway:**
- Railway Dashboard → New Service → Database → PostgreSQL
- Скопіюй `DATABASE_URL` з розділу Variables → встав у бекенд-сервіс

**Альтернатива — Render (безкоштовно, трохи повільніше):**
- [render.com](https://render.com) → New Web Service → підключи GitHub
- Для фронтенду: Static Site, Build Command: `npm run build`, Publish: `dist/`
- Для бекенду: Web Service, Root: `server/`, Start: `npm start`

---

## Аудит готовності

| Функція | Статус | Примітка |
|---|---|---|
| Telegram авторизація | ✅ Готово | HMAC-SHA256 валідація в `telegramAuth.ts` |
| UI / всі сторінки | ✅ Готово | React SPA з glassmorphism |
| Mock-дані (речі, послуги, статистика) | ✅ Готово | Вбудовані в компоненти |
| LiqPay checkout | ⚙️ Mock | Потрібні реальні ключі в `server/.env` |
| LiqPay callback | ⚙️ Mock | Потрібна БД для оновлення транзакцій |
| Нова Пошта пошук міст | ⚙️ Mock | Потрібен `VITE_NOVA_POSHTA_API_KEY` |
| Нова Пошта відділення | ⚙️ Mock | Потрібен API-ключ |
| PostgreSQL (реальна БД) | ⚙️ Потребує налаштування | `schema.sql` готова, потрібен `DATABASE_URL` |
| Завантаження фото | ⚙️ Заглушка | Потрібен S3/Cloudinary або локальне сховище |
| Модерація лотів | ⚙️ Заглушка | `status: pending_moderation` в схемі є |
| Монети / блокчейн | 🔜 Phase 2 | Концепт, бейдж «Скоро» |
| Фронт-Тил | 🔜 Phase 2 | Тизер «Скоро» |

---

## Безпека

- `LIQPAY_PRIVATE_KEY` і `BOT_TOKEN` — **тільки в `server/.env`**, ніколи на фронті
- `.env` та `server/.env` у `.gitignore`
- Telegram initData валідується через HMAC-SHA256 на кожен запит
- LiqPay callback підписується і перевіряється на бекенді
- Жодної зброї, боєприпасів, чутливих військових даних у лотах

---

## Чек-лист «що зробити вручну»

Дії, які може виконати тільки ти:

1. **Створи Telegram бота** через @BotFather (`/newbot`) → отримай `BOT_TOKEN`
2. **Зареєструйся на LiqPay** як мерчант → верифікуй → отримай `LIQPAY_PUBLIC_KEY` + `LIQPAY_PRIVATE_KEY`
3. **Зареєструйся на novaposhta.ua** → згенеруй `NOVA_POSHTA_API_KEY`
4. **Створи БД на Neon або Supabase** → скопіюй `DATABASE_URL` → застосуй `schema.sql`
5. **Зареєструйся на Railway або Render** → задеплой бекенд → встав усі змінні середовища
6. **Задеплой фронтенд на Vercel** → встав `VITE_API_URL` (URL бекенду) + `VITE_NOVA_POSHTA_API_KEY` + `VITE_LIQPAY_PUBLIC_KEY`
7. **Підключи Mini App** у BotFather: `/mybots` → твій бот → Menu Button → вкажи URL Vercel-деплою
8. **Налаштуй LiqPay `server_url`** (callback): в `server/.env` встав `FRONTEND_URL=https://твій-vercel.app`, а в коді `payments.ts` переконайся, що `server_url` вказує на `https://твій-railway.app/api/payments/callback`
9. **Завантаж схему БД**: `psql "$DATABASE_URL" -f server/src/db/schema.sql`
10. **Протестуй у Telegram**: відкрий бота → натисни Menu → перевір авторизацію → зроби тестовий платіж через LiqPay sandbox

---

## Ліцензія

MIT — використовуй, форкай, розвивай. Слава Україні! 🇺🇦
