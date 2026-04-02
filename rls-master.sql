-- =============================================
-- RLS MASTER LOCKDOWN SCRIPT
-- =============================================
-- This script physically locks down your database, preventing users from bypassing the frontend.
-- Run this securely in the Supabase SQL Editor.

-- #1 MEMBERS TABLE
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
-- Everyone can read members (public directories require this)
CREATE POLICY "Public read members" ON members FOR SELECT USING (true);
-- Users can update parts of their own record (points/roles are protected via DB Triggers)
CREATE POLICY "Users can update own member row" ON members FOR UPDATE USING (user_id = auth.uid());
-- Superadmins/Admins have full access
CREATE POLICY "Admins full access members" ON members FOR ALL USING (
    EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- #2 CTF CHALLENGES TABLE
ALTER TABLE ctf_challenges ENABLE ROW LEVEL SECURITY;
-- Anyone can see ACTIVE challenges
CREATE POLICY "Public read active challenges" ON ctf_challenges FOR SELECT USING (is_active = true);
-- Admins can do everything
CREATE POLICY "Admins full access ctf_challenges" ON ctf_challenges FOR ALL USING (
    EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);
-- 🔒 CRITICAL: Revoke access to the flag_hash column so hackers cannot steal encrypted flags!
-- (Service role used by the backend will still maintain bypass capabilities)
REVOKE SELECT (flag_hash) ON TABLE public.ctf_challenges FROM public, anon, authenticated;

-- #3 CTF SOLVES TABLE
ALTER TABLE ctf_solves ENABLE ROW LEVEL SECURITY;
-- Users can see their own captures
CREATE POLICY "Users view own solves" ON ctf_solves FOR SELECT USING (
    member_id IN (SELECT id FROM members WHERE user_id = auth.uid())
);
-- Users can insert their own captures via the API
CREATE POLICY "Users insert own solves" ON ctf_solves FOR INSERT WITH CHECK (
    member_id IN (SELECT id FROM members WHERE user_id = auth.uid())
);
-- Admins full access
CREATE POLICY "Admins full access ctf_solves" ON ctf_solves FOR ALL USING (
    EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- #4 CONTACT MESSAGES TABLE
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
-- Frontend uses service_role to insert, so we only need to give Admins read/delete access!
CREATE POLICY "Admins full access contact_messages" ON contact_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- #5 AUDIT LOGS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
-- Superadmin policy already exists in schema.sql, we just needed to enable RLS to enforce it.


