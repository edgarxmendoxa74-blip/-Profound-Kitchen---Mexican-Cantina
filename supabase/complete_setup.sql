-- Profound + Kitchen Mexican Cantina - Complete Database Setup
-- This script consolidates all migrations into a single file for fresh initialization.

-- 1. Helper Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Tables Creation
-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL DEFAULT '🌮',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  base_price decimal(10,2) NOT NULL,
  category text REFERENCES categories(id),
  popular boolean DEFAULT false,
  available boolean DEFAULT true,
  image_url text,
  images text[] DEFAULT '{}',
  weight decimal(10,2) DEFAULT 0.5,
  stock integer DEFAULT 0,
  discount_price decimal(10,2),
  discount_start_date timestamptz,
  discount_end_date timestamptz,
  discount_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Variations Table
CREATE TABLE IF NOT EXISTS variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  name text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  image text,
  stock integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add-ons Table
CREATE TABLE IF NOT EXISTS add_ons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  name text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id text PRIMARY KEY,
  value text NOT NULL,
  type text NOT NULL DEFAULT 'text',
  description text,
  updated_at timestamptz DEFAULT now()
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value decimal(10,2) NOT NULL,
  min_spend decimal(10,2) DEFAULT 0,
  active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
  id text PRIMARY KEY,
  name text NOT NULL,
  account_number text NOT NULL,
  account_name text NOT NULL,
  qr_code_url text NOT NULL,
  active boolean DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Helper to create policies if they don't exist
DO $$ 
BEGIN
    -- Public Read Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Categories') THEN
        CREATE POLICY "Public Read Categories" ON categories FOR SELECT TO public USING (active = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Menu Items') THEN
        CREATE POLICY "Public Read Menu Items" ON menu_items FOR SELECT TO public USING (available = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Variations') THEN
        CREATE POLICY "Public Read Variations" ON variations FOR SELECT TO public USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Add-ons') THEN
        CREATE POLICY "Public Read Add-ons" ON add_ons FOR SELECT TO public USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Site Settings') THEN
        CREATE POLICY "Public Read Site Settings" ON site_settings FOR SELECT TO public USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Coupons') THEN
        CREATE POLICY "Public Read Coupons" ON coupons FOR SELECT TO public USING (active = true AND (expires_at IS NULL OR expires_at > now()));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Payment Methods') THEN
        CREATE POLICY "Public Read Payment Methods" ON payment_methods FOR SELECT TO public USING (true);
    END IF;

    -- Admin Manage Policies (Simplified for public access for now as per project migrations)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Manage Categories') THEN
        CREATE POLICY "Admin Manage Categories" ON categories FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Manage Menu Items') THEN
        CREATE POLICY "Admin Manage Menu Items" ON menu_items FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Manage Variations') THEN
        CREATE POLICY "Admin Manage Variations" ON variations FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Manage Add-ons') THEN
        CREATE POLICY "Admin Manage Add-ons" ON add_ons FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Manage Site Settings') THEN
        CREATE POLICY "Admin Manage Site Settings" ON site_settings FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Manage Coupons') THEN
        CREATE POLICY "Admin Manage Coupons" ON coupons FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin Manage Payment Methods') THEN
        CREATE POLICY "Admin Manage Payment Methods" ON payment_methods FOR ALL TO public USING (true) WITH CHECK (true);
    END IF;
END $$;

-- 4. Triggers
CREATE OR REPLACE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Storage Configuration
INSERT INTO storage.buckets (id, name, public)
SELECT 'menu-images', 'menu-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'menu-images');

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'menu-images');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Uploads' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Uploads" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'menu-images');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Manage' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Manage" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'menu-images');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Delete' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Delete" ON storage.objects FOR DELETE TO public USING (bucket_id = 'menu-images');
    END IF;
END $$;

-- 6. SEED DATA (Mexican Cantina Theme)
TRUNCATE TABLE variations CASCADE;
TRUNCATE TABLE add_ons CASCADE;
TRUNCATE TABLE menu_items CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE coupons CASCADE;
TRUNCATE TABLE payment_methods CASCADE;

-- Categories
INSERT INTO categories (id, name, icon, sort_order) VALUES
  ('tacos', 'Signature Tacos', '🌮', 1),
  ('burritos', 'Hearty Burritos', '🌯', 2),
  ('quesadillas', 'Cheesy Quesadillas', '🧀', 3),
  ('drinks', 'Refreshing Drinks', '🥤', 4),
  ('sides', 'Side Delights', '🥗', 5);

-- Menu Items
INSERT INTO menu_items (id, name, description, base_price, category, popular, image_url) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Al Pastor Tacos', 'Traditional marinated pork with pineapple, cilantro, and onions on corn tortillas.', 180, 'tacos', true, 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Carne Asada Burrito', 'Grilled steak, Mexican rice, black beans, guacamole, and salsa in a large flour tortilla.', 320, 'burritos', true, 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Chicken Quesadilla', 'Melted Oaxaca cheese and seasoned grilled chicken in a crispy flour tortilla.', 250, 'quesadillas', false, 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Horchata', 'Traditional sweet rice milk drink with cinnamon and vanilla over ice.', 95, 'drinks', true, 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg');

-- Variations (Portion sizes)
INSERT INTO variations (menu_item_id, name, price)
SELECT id, unnest(ARRAY['Regular', 'Large']), 0 FROM menu_items WHERE category != 'drinks';

INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Extra Meat', 60 FROM menu_items WHERE category IN ('tacos', 'burritos');

-- Add-ons
INSERT INTO add_ons (menu_item_id, name, price, category) 
SELECT id, 'Extra Guacamole', 45, 'sauce' FROM menu_items WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12';

-- Site Settings
INSERT INTO site_settings (id, value, type, description) VALUES
  ('site_name', 'Profound Kitchen - Mexican Cantina', 'text', 'The name of the restaurant'),
  ('site_logo', '/images/brand-logo.png', 'image', 'The logo image for the site'),
  ('site_description', 'Experience the vibrant flavors of Mexico right in the heart of Quezon City.', 'text', 'Short description of the store'),
  ('events_title', 'Host Your <br /><span class="text-brand-violet italic">Grand Event.</span>', 'text', 'Main title for the Events section.'),
  ('events_description', 'From intimate celebrations to grand corporate gatherings, Profound + Kitchen provides the perfect backdrop of vibrant Mexican culture.', 'text', 'Description for events.'),
  ('location_address', '26-B Sct Borromeo, South Triangle, Quezon City', 'text', 'Store Address'),
  ('location_phone', '09062066175', 'text', 'Contact Phone'),
  ('shipping_rates', '{"LUZON": {"3": 190, "5": 320, "10": 620}, "VISAYAS": {"3": 200, "5": 370, "10": 720}}', 'text', 'Shipping rates JSON');

-- Coupons
INSERT INTO coupons (code, discount_type, discount_value, min_spend) VALUES
  ('WELCOME10', 'percentage', 10, 0),
  ('FIESTA100', 'fixed', 100, 1000);

-- Payment Methods
INSERT INTO payment_methods (id, name, account_number, account_name, qr_code_url, sort_order) VALUES
  ('gcash', 'GCash', '0906 206 6175', 'Profound Kitchen', '/images/qr-gcash.png', 1),
  ('maya', 'Maya', '0906 206 6175', 'Profound Kitchen', '/images/qr-maya.png', 2);
