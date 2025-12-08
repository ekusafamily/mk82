-- Create storage bucket for Excel uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-lists', 'member-lists', false);

-- Create policies for member lists bucket
CREATE POLICY "Authenticated users can upload member lists"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'member-lists' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view member lists"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'member-lists' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete member lists"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'member-lists' AND auth.uid() IS NOT NULL);

-- Create members table (replacing the registration concept)
CREATE TABLE public.members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_number text NOT NULL UNIQUE,
  name text NOT NULL,
  email text,
  phone_number text,
  course text,
  year_of_study text,
  uploaded_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Anyone can verify if they're a member (for login)
CREATE POLICY "Anyone can verify membership"
ON public.members
FOR SELECT
USING (true);

-- Only authenticated users can manage members
CREATE POLICY "Authenticated users can manage members"
ON public.members
FOR ALL
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create index for faster lookups
CREATE INDEX idx_members_registration_number ON public.members(registration_number);
CREATE INDEX idx_members_name ON public.members(name);