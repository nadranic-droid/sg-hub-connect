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

