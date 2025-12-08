-- Create event interests table to track member interest in events
CREATE TABLE public.event_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL,
  event_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_member_id FOREIGN KEY (member_id) REFERENCES public.membership_registrations(id) ON DELETE CASCADE,
  CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  UNIQUE(member_id, event_id)
);

-- Enable Row Level Security
ALTER TABLE public.event_interests ENABLE ROW LEVEL SECURITY;

-- Create policies for event interests
CREATE POLICY "Anyone can express interest in events" 
ON public.event_interests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view all event interests" 
ON public.event_interests 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage event interests" 
ON public.event_interests 
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);