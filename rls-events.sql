-- =============================================
-- RLS POLICIES FOR PUBLIC EVENTS
-- =============================================
-- Copy and run this in your Supabase SQL Editor to secure your events table.

-- 1. Enable RLS on the table
ALTER TABLE public_events ENABLE ROW LEVEL SECURITY;

-- 2. Allow anyone (public website visitors and regular members) to read PUBLISHED events
CREATE POLICY "Anyone can view published events"
  ON public_events
  FOR SELECT
  USING (is_published = true);

-- 3. Allow Admins and Superadmins to perform all operations (Select, Insert, Update, Delete) on ALL events (including drafts)
CREATE POLICY "Admins have full access to events"
  ON public_events
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM members 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'superadmin')
    )
  );
