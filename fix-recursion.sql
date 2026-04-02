-- =============================================
-- INFINITE RECURSION HOTFIX
-- =============================================
-- The previous Admin policy on the "members" table caused an infinite loop 
-- because it tried to select from "members" while already querying "members".
-- This hotfix removes the recursive policy and applies safe access controls.

-- 1. Drop the flawed recursive policy
DROP POLICY IF EXISTS "Admins full access members" ON members;

-- 2. Admins already have SELECT access via the "Public read members" policy.
--    We only need to grant them UPDATE and DELETE permission safely.
CREATE POLICY "Admins update members" ON members FOR UPDATE USING (
    EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

CREATE POLICY "Admins delete members" ON members FOR DELETE USING (
    EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- Note: The other tables (ctf_challenges, contact_messages, etc.) are safe 
-- because they query a *different* table (members) to verify the role.
