-- Migration: Add city and state structure for SEO-optimized city pages
-- Creates cities and states tables, links neighbourhoods to cities

-- Create states table (for Singapore, this might be regions/districts)
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  code TEXT, -- e.g., "SG" for Singapore
  description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  state_id UUID REFERENCES states(id) ON DELETE CASCADE,
  description TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  postal_codes TEXT[], -- Array of postal codes in this city
  seo_title TEXT,
  seo_description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_from_submission BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(state_id, slug) -- Unique slug per state
);

-- Create city FAQs table
CREATE TABLE IF NOT EXISTS city_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nearby cities relationship table
CREATE TABLE IF NOT EXISTS nearby_cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  nearby_city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  distance_km NUMERIC, -- Distance in kilometers
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(city_id, nearby_city_id),
  CHECK (city_id != nearby_city_id) -- Prevent self-reference
);

-- Add city_id to neighbourhoods table (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'neighbourhoods' AND column_name = 'city_id'
  ) THEN
    ALTER TABLE neighbourhoods ADD COLUMN city_id UUID REFERENCES cities(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add city_id to businesses table (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'businesses' AND column_name = 'city_id'
  ) THEN
    ALTER TABLE businesses ADD COLUMN city_id UUID REFERENCES cities(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add submitted_by_email to businesses table for guest submissions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'businesses' AND column_name = 'submitted_by_email'
  ) THEN
    ALTER TABLE businesses ADD COLUMN submitted_by_email TEXT;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cities_state ON cities(state_id);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);
CREATE INDEX IF NOT EXISTS idx_cities_public ON cities(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_city_faqs_city ON city_faqs(city_id);
CREATE INDEX IF NOT EXISTS idx_nearby_cities_city ON nearby_cities(city_id);
CREATE INDEX IF NOT EXISTS idx_nearby_cities_nearby ON nearby_cities(nearby_city_id);
CREATE INDEX IF NOT EXISTS idx_neighbourhoods_city ON neighbourhoods(city_id);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city_id);

-- Function to automatically generate nearby cities based on coordinates
CREATE OR REPLACE FUNCTION calculate_nearby_cities(
  target_city_id UUID,
  max_distance_km NUMERIC DEFAULT 20
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  target_lat NUMERIC;
  target_lng NUMERIC;
BEGIN
  -- Get target city coordinates
  SELECT latitude, longitude INTO target_lat, target_lng
  FROM cities WHERE id = target_city_id;
  
  IF target_lat IS NULL OR target_lng IS NULL THEN
    RETURN;
  END IF;
  
  -- Delete existing nearby cities
  DELETE FROM nearby_cities WHERE city_id = target_city_id;
  
  -- Calculate distances and insert nearby cities
  INSERT INTO nearby_cities (city_id, nearby_city_id, distance_km)
  SELECT 
    target_city_id,
    c.id,
    -- Haversine formula for distance calculation
    6371 * acos(
      cos(radians(target_lat)) * 
      cos(radians(c.latitude)) * 
      cos(radians(c.longitude) - radians(target_lng)) + 
      sin(radians(target_lat)) * 
      sin(radians(c.latitude))
    ) AS distance_km
  FROM cities c
  WHERE 
    c.id != target_city_id
    AND c.latitude IS NOT NULL
    AND c.longitude IS NOT NULL
    AND c.is_public = true
    AND (
      6371 * acos(
        cos(radians(target_lat)) * 
        cos(radians(c.latitude)) * 
        cos(radians(c.longitude) - radians(target_lng)) + 
        sin(radians(target_lat)) * 
        sin(radians(c.latitude))
      )
    ) <= max_distance_km
  ORDER BY distance_km
  LIMIT 10; -- Limit to 10 nearest cities
END;
$$;

-- Insert default Singapore state if it doesn't exist
INSERT INTO states (name, slug, code, description, seo_title, seo_description)
VALUES (
  'Singapore',
  'singapore',
  'SG',
  'Singapore - A vibrant city-state known for its diverse halal food scene',
  'Halal Businesses in Singapore | Humble Halal',
  'Discover the best halal businesses in Singapore. Find restaurants, cafes, shops and services across the island.'
)
ON CONFLICT (slug) DO NOTHING;

-- Comments
COMMENT ON TABLE cities IS 'Cities/areas within states for SEO-optimized city pages';
COMMENT ON TABLE city_faqs IS 'Frequently asked questions for city pages, dynamically generated';
COMMENT ON TABLE nearby_cities IS 'Relationships between cities for internal linking';
COMMENT ON FUNCTION calculate_nearby_cities IS 'Automatically calculates and stores nearby cities based on geographic coordinates';

