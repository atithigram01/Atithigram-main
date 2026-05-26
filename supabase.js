import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://wiysdqumkgjajafnjqki.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpeXNkcXVta2dqYWphZm5qcWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3OTg5NzAsImV4cCI6MjA5NTM3NDk3MH0.RZ6k7cGedwFWH9DOhxQKseFlCgTslk-3ZeOK1VasT0w ";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
