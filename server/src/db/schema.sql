-- Головний Ринок - PostgreSQL Schema
-- Charity marketplace where items and services become contributions to ЗСУ

-- Users (authenticated via Telegram)
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY, -- Telegram user ID
  username VARCHAR(255),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  photo_url TEXT,
  total_contribution DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Item categories
CREATE TYPE item_category AS ENUM (
  'техніка', 'інструменти', 'туризм', 'одяг', 'дім',
  'дитяче', 'авто', 'хобі', 'вінтаж', 'хендмейд', 'спорядження', 'книги'
);

-- Item status
CREATE TYPE item_status AS ENUM ('pending_moderation', 'active', 'reserved', 'sold', 'rejected');

-- Items (goods for sale)
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  legend TEXT, -- "легенда речі" - story of the item
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  category item_category NOT NULL,
  city VARCHAR(255) NOT NULL,
  status item_status NOT NULL DEFAULT 'pending_moderation',
  images JSONB DEFAULT '[]'::jsonb,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service categories
CREATE TYPE service_category AS ENUM (
  'освіта', 'дизайн', 'IT', 'ремонт', 'фото/відео', 'краса', 'переклади', 'юридичні'
);

-- Service format
CREATE TYPE service_format AS ENUM ('онлайн', 'офлайн', 'онлайн/офлайн');

-- Service status
CREATE TYPE service_status AS ENUM ('pending_moderation', 'active', 'sold', 'rejected');

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  category service_category NOT NULL,
  format service_format NOT NULL DEFAULT 'онлайн',
  duration VARCHAR(100),
  status service_status NOT NULL DEFAULT 'pending_moderation',
  contact_info TEXT, -- revealed after payment
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contribution directions
CREATE TYPE contribution_direction AS ENUM (
  'Розробка дронів',
  'Гурток «Науковий»',
  '3-тя штурмова',
  '47-ма МАҐУРА'
);

-- Transaction status
CREATE TYPE transaction_status AS ENUM (
  'pending', 'processing', 'success', 'failed', 'refunded'
);

-- Transactions (payments)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id BIGINT NOT NULL REFERENCES users(id),
  item_id UUID REFERENCES items(id),
  service_id UUID REFERENCES services(id),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  liqpay_order_id VARCHAR(255) UNIQUE NOT NULL,
  liqpay_payment_id VARCHAR(255),
  status transaction_status NOT NULL DEFAULT 'pending',
  direction contribution_direction NOT NULL DEFAULT 'Розробка дронів',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chk_item_or_service CHECK (
    (item_id IS NOT NULL AND service_id IS NULL) OR
    (item_id IS NULL AND service_id IS NOT NULL)
  )
);

-- Contributions (verified transfers to ЗСУ)
CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  direction contribution_direction NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_document TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nova Poshta orders (for item delivery)
CREATE TABLE IF NOT EXISTS nova_poshta_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  tracking_number VARCHAR(100),
  sender_city VARCHAR(255) NOT NULL,
  sender_branch_ref VARCHAR(255),
  receiver_city VARCHAR(255) NOT NULL,
  receiver_branch_ref VARCHAR(255) NOT NULL,
  receiver_branch_description TEXT,
  status VARCHAR(100) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_seller ON items(seller_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_liqpay ON transactions(liqpay_order_id);
CREATE INDEX IF NOT EXISTS idx_contributions_direction ON contributions(direction);

-- Views for transparency dashboard
CREATE OR REPLACE VIEW transparency_stats AS
SELECT
  COUNT(*) as total_transactions,
  SUM(amount) as total_collected,
  direction,
  DATE_TRUNC('month', created_at) as month
FROM contributions
WHERE verified_at IS NOT NULL
GROUP BY direction, DATE_TRUNC('month', created_at);

-- Function to update user total_contribution
CREATE OR REPLACE FUNCTION update_user_contribution()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verified_at IS NOT NULL AND OLD.verified_at IS NULL THEN
    UPDATE users u
    SET total_contribution = total_contribution + NEW.amount
    FROM transactions t
    WHERE t.id = NEW.transaction_id AND u.id = t.buyer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_update_contribution
  AFTER UPDATE ON contributions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_contribution();
