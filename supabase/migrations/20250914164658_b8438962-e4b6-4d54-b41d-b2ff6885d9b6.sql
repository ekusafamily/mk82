-- Create news table
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  expected_attendees INTEGER DEFAULT 0,
  actual_attendees INTEGER DEFAULT 0,
  is_past BOOLEAN NOT NULL DEFAULT false,
  images TEXT[],
  highlight TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required for viewing)
CREATE POLICY "Anyone can view news" 
ON public.news 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view events" 
ON public.events 
FOR SELECT 
USING (true);

-- Create policies for admin operations (will need auth later)
CREATE POLICY "Authenticated users can manage news" 
ON public.news 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage events" 
ON public.events 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample news data
INSERT INTO public.news (title, excerpt, content, author, category, featured, image) VALUES
('EKUSA Wins Outstanding Student Organization Award', 'We''re thrilled to announce that EKUSA has been recognized as the Outstanding Student Organization of the Year by the University Senate.', 'This prestigious award recognizes our commitment to student welfare, community service, and academic excellence. The award was presented during the annual University Awards Ceremony, acknowledging our various initiatives including the blood donation drives, academic support programs, and community outreach activities. We thank all our members for their dedication and support that made this achievement possible.', 'Sarah Mwangi', 'Achievement', true, 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&h=400&fit=crop'),
('New Scholarship Program Launched for EKUSA Members', 'Exciting news! We''re launching a scholarship program to support academically excellent EKUSA members facing financial challenges.', 'The EKUSA Excellence Scholarship will provide financial support to 10 outstanding members each semester. The scholarship covers tuition fees, books, and other academic expenses. Applications are now open for all active EKUSA members with a minimum GPA of 3.5. The selection process will consider academic performance, community involvement, and financial need.', 'Michael Ochieng', 'Scholarship', false, 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop');

-- Insert sample events data
INSERT INTO public.events (title, description, event_date, event_time, location, type, expected_attendees, is_past) VALUES
('Weekly Meeting', 'Join us for our monthly meeting to discuss upcoming initiatives, share updates, and plan future activities.', '2024-02-15', '14:00:00', 'Main Auditorium', 'Meeting', 120, false),
('Mount Kenya Hiking Adventure', 'An exciting outdoor adventure to explore Mount Kenya''s beautiful trails and bond with fellow students.', '2024-02-22', '06:00:00', 'Mount Kenya National Park', 'Adventure', 45, false),
('Blood Donation Drive', 'Successful blood donation campaign in partnership with Kenya Red Cross.', '2024-01-10', '09:00:00', 'Medical Center', 'Charity', 150, true);

-- Update past event with actual attendees and highlight
UPDATE public.events 
SET actual_attendees = 150, highlight = 'Collected 120 units of blood, helping save lives in our community!', images = ARRAY['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop']
WHERE title = 'Blood Donation Drive';