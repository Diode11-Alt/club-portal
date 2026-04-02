async function verifyDB() {
    const SUPABASE_URL = "https://zxzrpinazonceqghucyp.supabase.co";
    const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4enJwaW5hem9uY2VxZ2h1Y3lwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU2ODA1MywiZXhwIjoyMDg3MTQ0MDUzfQ.grfNgsJXOrQ85ryHfOi6LZj7IM_USEBFZvVFvrndeRk";

    // Fetch OpenAPI spec
    const res = await fetch(`${SUPABASE_URL}/rest/v1/?apikey=${SERVICE_KEY}`, {
        headers: {
            'Authorization': `Bearer ${SERVICE_KEY}`
        }
    });

    if (!res.ok) {
        console.error("Failed to fetch OpenAPI spec", await res.text());
        process.exit(1);
    }

    const spec = await res.json();
    const tables = Object.keys(spec.definitions || {}).map(t => t.toLowerCase());

    const required = [
        'members', 'posts', 'post_reactions', 'post_comments',
        'conversations', 'conversation_participants', 'messages', 'notifications',
        'documents', 'public_events', 'event_rsvps', 'ctf_challenges', 'ctf_solves',
        'gallery_images', 'contact_messages', 'audit_logs', 'site_settings', 'meeting_minutes', 'skill_endorsements'
    ];

    let missing = [];
    for (const t of required) {
        if (!tables.includes(t)) missing.push(t);
    }

    console.log("2A.1 & 2A.5 Schema Completeness:");
    if (missing.length === 0) {
        console.log("PASS: All required tables found in OpenAPI spec.");
    } else {
        console.error("FAIL: Missing tables:", missing.join(', '));
        process.exit(1);
    }

    // Role and club_post constraints, RLS, Trigger are best tested using REST inserts
    console.log("Since we lack direct SQL access, testing check constraints with inserts...");

    // 2A.2 Role CHECK includes 'superadmin'
    const payload = {
        id: crypto.randomUUID(),
        user_id: crypto.randomUUID(),
        email: 'test_superadmin@iimscollege.edu.np',
        full_name: 'SuperAdmin Test',
        role: 'superadmin',
        club_post: 'General Member',
        status: 'pending'
    };

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/members`, {
        method: 'POST',
        headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
    });

    if (!insertRes.ok) {
        const err = await insertRes.json();
        if (err.code === '23514') { // check_violation
            console.error("FAIL 2A.2: superadmin role rejected by DB CHECK", err);
            process.exit(1);
        } else if (err.code === '23505') { // unique_violation
            console.log("PASS 2A.2: uniqueness violation confirms check is valid");
        } else {
            console.error("UNKNOWN ERROR for 2A.2", err);
        }
    } else {
        console.log("PASS 2A.2: superadmin role valid");
        // Clean up
        await fetch(`${SUPABASE_URL}/rest/v1/members?id=eq.${payload.id}`, {
            method: 'DELETE',
            headers: {
                'apikey': SERVICE_KEY,
                'Authorization': `Bearer ${SERVICE_KEY}`,
            }
        });
    }

    // Check RLS (2B) via Anon key
    const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4enJwaW5hem9uY2VxZ2h1Y3lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NjgwNTMsImV4cCI6MjA4NzE0NDA1M30.rthWZ-GJQttXkRyZ5Mty2QzkS7rp1AtBpoMqD9aJxdI";
    const anonRes = await fetch(`${SUPABASE_URL}/rest/v1/members`, {
        headers: {
            'apikey': ANON_KEY,
            'Authorization': `Bearer ${ANON_KEY}`
        }
    });
    const anonData = await anonRes.json();
    if (anonData.length > 0) {
        console.warn("WARNING: Anon can read members. RLS might be permissive.");
    } else {
        console.log("PASS 2B: Basic RLS active (Anon sees 0 rows).");
    }
}

verifyDB().catch(console.error);
