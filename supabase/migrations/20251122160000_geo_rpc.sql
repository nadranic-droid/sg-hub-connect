-- Function to find nearest neighbourhood using basic distance formula
-- (In production, use PostGIS for accurate geospatial queries)
CREATE OR REPLACE FUNCTION get_nearest_neighbourhood(lat DECIMAL, long DECIMAL)
RETURNS TABLE (name TEXT, distance DECIMAL)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.name,
    (
      (n.latitude - lat)^2 + 
      (n.longitude - long)^2
    ) as distance
  FROM neighbourhoods n
  WHERE n.latitude IS NOT NULL AND n.longitude IS NOT NULL
  ORDER BY distance ASC
  LIMIT 1;
END;
$$;

