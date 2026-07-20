-- Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE CASCADE NOT NULL,
  overall_score INTEGER NOT NULL,
  communication INTEGER,
  technical INTEGER,
  confidence INTEGER,
  strengths JSONB,
  improvements JSONB,
  summary TEXT,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own reports" ON public.reports
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.interview_sessions WHERE id = session_id
    )
  );

CREATE POLICY "Users can insert their own reports" ON public.reports
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.interview_sessions WHERE id = session_id
    )
  );

CREATE POLICY "Users can update their own reports" ON public.reports
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.interview_sessions WHERE id = session_id
    )
  );

-- Create trigger to update updated_at
CREATE TRIGGER set_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reports_session_id ON public.reports(session_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
