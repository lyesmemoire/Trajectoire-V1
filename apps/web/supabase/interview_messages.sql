-- Create interview_messages table
CREATE TABLE IF NOT EXISTS public.interview_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL, -- 'assistant' or 'user'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.interview_messages ENABLE ROW LEVEL SECURITY;

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_interview_messages_session_id ON public.interview_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_messages_created_at ON public.interview_messages(created_at);
