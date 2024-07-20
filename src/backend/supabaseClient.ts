// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ekpzobkzsngocedllxqn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrcHpvYmt6c25nb2NlZGxseHFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzNjEwMTAsImV4cCI6MjAzMzkzNzAxMH0.Ng9z4PVspsuKfB0W0V8YMq8OUR07T9suaouu8Qzv-wg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
