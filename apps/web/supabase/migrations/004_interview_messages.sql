-- Migration 004: Interview Messages Table
-- Creates the interview_messages table with RLS policies

-- Create table
CREATE TABLE IF NOT EXISTS public.interview_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL, -- 'assistant' or 'user'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.interview_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own messages" ON public.interview_messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON public.interview_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.interview_messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON public.interview_messages;

-- Create policies
CREATE POLICY "Users can view their own messages" ON public.interview_messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.interview_sessions WHERE id = session_id
    )
  );

CREATE POLICY "Users can insert their own messages" ON public.interview_messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.interview_sessions WHERE id = session_id
    )
  );

CREATE POLICY "Users can update their own messages" ON public.interview_messages
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.interview_sessions WHERE id = session_id
    )
  );

CREATE POLICY "Users can delete their own messages" ON public.interview_messages
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.interview_sessions WHERE id = session_id
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_interview_messages_session_id ON public.interview_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_messages_created_at ON public.interview_messages(created_at);
