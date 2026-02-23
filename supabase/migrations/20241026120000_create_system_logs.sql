-- Migration to add system_logs table for centralized logging
-- Created by Agent as part of 'Systemweite kostenfreie Lösungen'
-- Run this in Supabase SQL Editor or apply via migration tool

CREATE TABLE IF NOT EXISTS public.system_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    level text NOT NULL,
    message text NOT NULL,
    metadata text, -- Storing JSON as text for compatibility across DB types
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performant querying of logs
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON public.system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON public.system_logs(created_at);

-- Enable Row Level Security (RLS) but allow inserts for authenticated service role or anon if needed
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Allow insert access for authenticated users and service role (and anon for public logging)
CREATE POLICY "Enable insert for all users" ON public.system_logs FOR INSERT TO anon, authenticated, service_role WITH CHECK (true);
CREATE POLICY "Enable read access for service_role only" ON public.system_logs FOR SELECT TO service_role USING (true);
