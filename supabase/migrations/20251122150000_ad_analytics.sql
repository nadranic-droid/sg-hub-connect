-- Create RPC functions for ad analytics
CREATE OR REPLACE FUNCTION increment_ad_impression(ad_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.ad_slots
  SET impressions = impressions + 1
  WHERE id = ad_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_ad_click(ad_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.ad_slots
  SET clicks = clicks + 1
  WHERE id = ad_id;
END;
$$;

