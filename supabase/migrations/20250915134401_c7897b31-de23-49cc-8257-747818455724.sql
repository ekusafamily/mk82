-- Create membership registrations table
CREATE TABLE public.membership_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  course TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  year_of_study TEXT,
  reason_for_joining TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.membership_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for membership registrations
CREATE POLICY "Anyone can register for membership" 
ON public.membership_registrations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view all membership registrations" 
ON public.membership_registrations 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update membership registrations" 
ON public.membership_registrations 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete membership registrations" 
ON public.membership_registrations 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_membership_registrations_updated_at
BEFORE UPDATE ON public.membership_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();