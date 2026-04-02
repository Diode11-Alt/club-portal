-- =============================================
-- CRITICAL RECURSION HOTFIX V3
-- =============================================

-- 1. Drop the hidden recursive SELECT policy that is causing the crash:
DROP POLICY IF EXISTS "Superadmin sees all members" ON members;

-- 2. Drop the original recursive ALL policy:
DROP POLICY IF EXISTS "Admins full access members" ON members;

-- 3. Ensure everyone can safely read the members list without recursion:
DROP POLICY IF EXISTS "Public read members" ON members;
CREATE POLICY "Public read members" ON members FOR SELECT USING (true);

-- 4. Safely add back the Admin update/delete powers. 
-- Fixed the ambiguous 'role' error by explicitly selecting 'm.role'.
DROP POLICY IF EXISTS "Admins update members" ON members;
CREATE POLICY "Admins update members" ON members FOR UPDATE USING (
    (SELECT m.role FROM members m WHERE m.user_id = auth.uid() LIMIT 1) IN ('admin', 'superadmin')
);

DROP POLICY IF EXISTS "Admins delete members" ON members;
CREATE POLICY "Admins delete members" ON members FOR DELETE USING (
    (SELECT m.role FROM members m WHERE m.user_id = auth.uid() LIMIT 1) IN ('admin', 'superadmin')
);

-- =============================================
-- PROMOTION SCRIPT (Run this if you are still stuck at pending!)
-- Replace with your actual email address.
-- =============================================
-- UPDATE members 
-- SET status = 'approved', role = 'superadmin', club_post = 'President' 
-- WHERE email = 'jerrysm97@gmail.com';
