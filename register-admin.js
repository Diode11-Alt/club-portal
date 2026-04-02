import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yivcyunmttunvlavctnq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdmN5dW5tdHR1bnZsYXZjdG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NzEyMjIsImV4cCI6MjA5MDI0NzIyMn0.XWzp1tXFQD012BbMfphLF2Uehl8u_A8xWsVn45xiwEw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function register() {
  const { data, error } = await supabase.auth.signUp({
    email: 'sujalmainali11@gmail.com',
    password: 'sujal123',
    options: {
      data: {
        full_name: 'Sujal Mainali'
      }
    }
  });

  if (error) {
    console.error('Registration failed:', error.message);
  } else {
    console.log('Registration successful! User ID:', data.user?.id);
  }
}

register();
