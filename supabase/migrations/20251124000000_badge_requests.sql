-- Migration: Badge Requests Table
-- Stores requests from businesses wanting to add badges for free featured listing

CREATE TABLE IF NOT EXISTS badge_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website_url TEXT NOT NULL,
  listing_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  badge_location TEXT, -- Where on their site they added it (footer, sidebar, etc.)
  request_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'coupon_sent')),
  coupon_code TEXT,
  verification_notes TEXT,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_badge_requests_status ON badge_requests(status);
CREATE INDEX IF NOT EXISTS idx_badge_requests_email ON badge_requests(email);
CREATE INDEX IF NOT EXISTS idx_badge_requests_listing ON badge_requests(listing_id);
CREATE INDEX IF NOT EXISTS idx_badge_requests_date ON badge_requests(request_date DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_badge_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER badge_requests_updated_at
  BEFORE UPDATE ON badge_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_badge_requests_updated_at();

-- Comments
COMMENT ON TABLE badge_requests IS 'Stores badge redemption requests from businesses for free featured listing month';
COMMENT ON COLUMN badge_requests.status IS 'pending, verified, rejected, or coupon_sent';
COMMENT ON COLUMN badge_requests.coupon_code IS 'Generated coupon code for one free month of featured listing';

