-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'business_owner', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  business_count INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create neighbourhoods table
CREATE TABLE public.neighbourhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  region TEXT NOT NULL,
  description TEXT,
  image TEXT,
  postal_codes TEXT[],
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  business_count INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  address TEXT NOT NULL,
  postal_code TEXT,
  neighbourhood_id UUID REFERENCES public.neighbourhoods(id) ON DELETE SET NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  website TEXT,
  whatsapp TEXT,
  operating_hours JSONB,
  price_range TEXT,
  amenities TEXT[],
  images TEXT[],
  logo TEXT,
  cover_image TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_claimed BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  views_count INTEGER DEFAULT 0,
  avg_rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  images TEXT[],
  is_verified BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, business_id)
);

-- Create claims table
CREATE TABLE public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  proof_documents TEXT[],
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create enquiries table
CREATE TABLE public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create analytics table
CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighbourhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "User roles viewable by owner"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Categories policies (public read)
CREATE POLICY "Categories viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON public.categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Neighbourhoods policies (public read)
CREATE POLICY "Neighbourhoods viewable by everyone"
  ON public.neighbourhoods FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage neighbourhoods"
  ON public.neighbourhoods FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Businesses policies
CREATE POLICY "Approved businesses viewable by everyone"
  ON public.businesses FOR SELECT
  USING (status = 'approved' OR owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create businesses"
  ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners and admins can update businesses"
  ON public.businesses FOR UPDATE
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners and admins can delete businesses"
  ON public.businesses FOR DELETE
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- Reviews policies
CREATE POLICY "Approved reviews viewable by everyone"
  ON public.reviews FOR SELECT
  USING (status = 'approved' OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Favorites policies
CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites"
  ON public.favorites FOR ALL
  USING (auth.uid() = user_id);

-- Claims policies
CREATE POLICY "Users can view own claims"
  ON public.claims FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can create claims"
  ON public.claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can manage claims"
  ON public.claims FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Enquiries policies
CREATE POLICY "Business owners and admins can view enquiries"
  ON public.enquiries FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid()) OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Anyone can create enquiries"
  ON public.enquiries FOR INSERT
  WITH CHECK (true);

-- Analytics policies (insert only, admin view)
CREATE POLICY "Anyone can insert analytics"
  ON public.analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view analytics"
  ON public.analytics FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.neighbourhoods
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.claims
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_businesses_category ON public.businesses(category_id);
CREATE INDEX idx_businesses_neighbourhood ON public.businesses(neighbourhood_id);
CREATE INDEX idx_businesses_status ON public.businesses(status);
CREATE INDEX idx_businesses_slug ON public.businesses(slug);
CREATE INDEX idx_reviews_business ON public.reviews(business_id);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);
CREATE INDEX idx_favorites_user ON public.favorites(user_id);
CREATE INDEX idx_favorites_business ON public.favorites(business_id);
CREATE INDEX idx_analytics_business ON public.analytics(business_id);
CREATE INDEX idx_analytics_event ON public.analytics(event_type);