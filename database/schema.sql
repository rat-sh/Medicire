-- Medicire PostgreSQL Schema
-- Mirrors QuickMeds_Backend MongoDB models for reference / future migration.
-- Run: psql -U postgres -d medicire -f database/schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  phone           VARCHAR(15) DEFAULT '',
  role            VARCHAR(20) NOT NULL DEFAULT 'user'
                  CHECK (role IN ('user', 'pharmacist', 'admin')),
  avatar_url      TEXT,
  location        GEOGRAPHY(POINT, 4326),
  address_street  VARCHAR(255) DEFAULT '',
  address_city    VARCHAR(100) DEFAULT '',
  address_state   VARCHAR(100) DEFAULT '',
  address_pincode VARCHAR(10) DEFAULT '',
  age             SMALLINT CHECK (age IS NULL OR (age >= 1 AND age <= 120)),
  gender          VARCHAR(10) CHECK (gender IS NULL OR gender IN ('male', 'female', 'other')),
  is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  otp             VARCHAR(10),
  otp_expiry      TIMESTAMPTZ,
  refresh_token   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_location ON users USING GIST (location);
CREATE INDEX idx_users_phone ON users (phone);

-- ─── User chronic conditions ──────────────────────────────────────────────────
CREATE TABLE user_conditions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  condition  VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, condition)
);

-- ─── User saved addresses ─────────────────────────────────────────────────────
CREATE TABLE user_addresses (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label      VARCHAR(20) NOT NULL CHECK (label IN ('home', 'work', 'other')),
  line1      VARCHAR(255) NOT NULL,
  line2      VARCHAR(255),
  city       VARCHAR(100) NOT NULL,
  pincode    VARCHAR(10) NOT NULL,
  location   GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Pharmacies ───────────────────────────────────────────────────────────────
CREATE TABLE pharmacies (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id              UUID NOT NULL REFERENCES users(id),
  name                  VARCHAR(255) NOT NULL,
  registration_number   VARCHAR(100) UNIQUE NOT NULL,
  phone                 VARCHAR(15) NOT NULL,
  email                 VARCHAR(255) DEFAULT '',
  address_street        VARCHAR(255) NOT NULL,
  address_city          VARCHAR(100) NOT NULL,
  address_state         VARCHAR(100) NOT NULL,
  address_pincode       VARCHAR(10) NOT NULL,
  location              GEOGRAPHY(POINT, 4326) NOT NULL,
  is_open_24_hours      BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified           BOOLEAN NOT NULL DEFAULT FALSE,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  accepts_emergency     BOOLEAN NOT NULL DEFAULT TRUE,
  rating_average        NUMERIC(2,1) NOT NULL DEFAULT 0 CHECK (rating_average >= 0 AND rating_average <= 5),
  rating_count          INTEGER NOT NULL DEFAULT 0,
  medicine_count        INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pharmacies_location ON pharmacies USING GIST (location);
CREATE INDEX idx_pharmacies_city ON pharmacies (address_city);
CREATE INDEX idx_pharmacies_active ON pharmacies (is_verified, is_active);

CREATE TABLE pharmacy_operating_hours (
  pharmacy_id UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  day         VARCHAR(3) NOT NULL CHECK (day IN ('mon','tue','wed','thu','fri','sat','sun')),
  open_time   TIME NOT NULL DEFAULT '09:00',
  close_time  TIME NOT NULL DEFAULT '21:00',
  is_closed   BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (pharmacy_id, day)
);

-- ─── Medicines (inventory per pharmacy) ───────────────────────────────────────
CREATE TABLE medicines (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pharmacy_id           UUID NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  name                  VARCHAR(255) NOT NULL,
  generic_name          VARCHAR(255) DEFAULT '',
  brand                 VARCHAR(255) DEFAULT '',
  category              VARCHAR(50) NOT NULL DEFAULT 'other',
  dosage_form           VARCHAR(20) NOT NULL DEFAULT 'tablet',
  strength              VARCHAR(50) DEFAULT '',
  manufacturer          VARCHAR(255) DEFAULT '',
  requires_prescription BOOLEAN NOT NULL DEFAULT FALSE,
  quantity              INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  unit                  VARCHAR(20) NOT NULL DEFAULT 'strips',
  low_stock_threshold   INTEGER NOT NULL DEFAULT 5,
  mrp                   NUMERIC(10,2) NOT NULL CHECK (mrp >= 0),
  selling_price         NUMERIC(10,2) NOT NULL CHECK (selling_price >= 0),
  currency              VARCHAR(3) NOT NULL DEFAULT 'INR',
  batch_number          VARCHAR(100) DEFAULT '',
  expiry_date           DATE,
  image_url             TEXT,
  is_available          BOOLEAN NOT NULL DEFAULT TRUE,
  total_sold            INTEGER NOT NULL DEFAULT 0,
  stock_last_updated    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_medicines_pharmacy ON medicines (pharmacy_id, is_available);
CREATE INDEX idx_medicines_search ON medicines USING GIN (to_tsvector('english', name || ' ' || generic_name || ' ' || brand));

-- ─── Prescriptions (vault) ────────────────────────────────────────────────────
CREATE TABLE prescriptions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url    TEXT NOT NULL,
  public_id    VARCHAR(255),
  doctor_name  VARCHAR(255),
  uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE prescription_medicines (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  confidence      NUMERIC(3,2) CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1))
);

-- ─── Reservations ─────────────────────────────────────────────────────────────
CREATE TABLE reservations (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id),
  pharmacy_id         UUID NOT NULL REFERENCES pharmacies(id),
  total_amount        NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  status              VARCHAR(20) NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','confirmed','ready','completed','cancelled','expired')),
  prescription_url    TEXT,
  notes               VARCHAR(500) DEFAULT '',
  pharmacist_note     VARCHAR(500) DEFAULT '',
  expires_at          TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '2 hours'),
  confirmed_at        TIMESTAMPTZ,
  ready_at            TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  cancelled_at        TIMESTAMPTZ,
  cancellation_reason TEXT DEFAULT '',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reservations_user ON reservations (user_id, status);
CREATE INDEX idx_reservations_pharmacy ON reservations (pharmacy_id, status);

CREATE TABLE reservation_items (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  medicine_id    UUID NOT NULL REFERENCES medicines(id),
  name           VARCHAR(255) NOT NULL,
  quantity       INTEGER NOT NULL CHECK (quantity >= 1),
  price          NUMERIC(10,2) NOT NULL CHECK (price >= 0)
);

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(50) NOT NULL,
  title      VARCHAR(255) NOT NULL,
  body       TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications (user_id, is_read, created_at DESC);

-- ─── Recent searches (per user) ───────────────────────────────────────────────
CREATE TABLE recent_searches (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query      VARCHAR(255) NOT NULL,
  searched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, query)
);
