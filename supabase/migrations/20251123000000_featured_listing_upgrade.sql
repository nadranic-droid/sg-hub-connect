-- Migration: Add featured listing upgrade fields
-- Adds support for featured listing expiration and image galleries

-- Add featured_expires_at column to businesses table
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS featured_expires_at TIMESTAMP WITH TIME ZONE;

-- Add featured_images JSONB array for gallery (max 8 images)
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS featured_images JSONB DEFAULT '[]'::jsonb;

-- Add constraint to limit featured images to 8
ALTER TABLE businesses 
DROP CONSTRAINT IF EXISTS max_featured_images;

ALTER TABLE businesses 
ADD CONSTRAINT max_featured_images 
CHECK (jsonb_array_length(COALESCE(featured_images, '[]'::jsonb)) <= 8);

-- Create index for featured listings queries
CREATE INDEX IF NOT EXISTS idx_businesses_featured_expires 
ON businesses(is_featured, featured_expires_at) 
WHERE is_featured = true;

-- Function to automatically expire featured listings
CREATE OR REPLACE FUNCTION expire_featured_listings()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE businesses
  SET 
    is_featured = false,
    featured_expires_at = NULL
  WHERE 
    is_featured = true 
    AND featured_expires_at IS NOT NULL
    AND featured_expires_at < NOW();
END;
$$;

-- Create a table to track featured listing purchases
CREATE TABLE IF NOT EXISTS featured_listing_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  plan_type TEXT NOT NULL, -- 'monthly', 'quarterly', 'yearly'
  amount_paid NUMERIC NOT NULL,
  currency TEXT DEFAULT 'SGD',
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for purchases lookup
CREATE INDEX IF NOT EXISTS idx_featured_purchases_business 
ON featured_listing_purchases(business_id);

CREATE INDEX IF NOT EXISTS idx_featured_purchases_user 
ON featured_listing_purchases(user_id);

CREATE INDEX IF NOT EXISTS idx_featured_purchases_expires 
ON featured_listing_purchases(expires_at) 
WHERE is_active = true;

-- Add comment
COMMENT ON COLUMN businesses.featured_expires_at IS 'When the featured listing expires. NULL means no expiration or not featured.';
COMMENT ON COLUMN businesses.featured_images IS 'Array of image URLs for featured listing gallery (max 8 images)';
COMMENT ON TABLE featured_listing_purchases IS 'Tracks all featured listing purchases and payments';

