-- Create storage bucket for business images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-images', 'business-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for event images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for business-images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'business-images' );

CREATE POLICY "Anyone can upload business images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'business-images' AND
    (auth.role() = 'authenticated' OR auth.role() = 'anon')
);

-- Storage Policies for event-images
CREATE POLICY "Public Access Events"
ON storage.objects FOR SELECT
USING ( bucket_id = 'event-images' );

CREATE POLICY "Anyone can upload event images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'event-images' AND
    (auth.role() = 'authenticated' OR auth.role() = 'anon')
);

-- Allow anonymous users to submit businesses (pending status only)
CREATE POLICY "Guests can submit businesses"
ON public.businesses FOR INSERT
WITH CHECK (
    auth.role() = 'anon' AND
    status = 'pending'
);

-- Add missing columns to businesses table
ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS featured_expires_at TIMESTAMP WITH TIME ZONE;

-- Add missing columns to articles table
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create badge_requests table
CREATE TABLE IF NOT EXISTS public.badge_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_address TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  badge_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on badge_requests
ALTER TABLE public.badge_requests ENABLE ROW LEVEL SECURITY;

-- Badge requests policies
CREATE POLICY "Anyone can create badge requests"
ON public.badge_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view own badge requests"
ON public.badge_requests FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage badge requests"
ON public.badge_requests FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));