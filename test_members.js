import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yivcyunmttunvlavctnq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdmN5dW5tdHR1bnZsYXZjdG5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDY3MTIyMiwiZXhwIjoyMDkwMjQ3MjIyfQ.NdI3iT07SwYKLD7E8SgS6uB8Toek1cSUk5iQoxYLDKE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
    .from('members')
    .select('id, full_name, role, status, club_post, is_public_profile')

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Data:', data)
  }
}

test()
