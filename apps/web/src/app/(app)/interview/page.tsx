'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { InterviewWorkspace } from '@/components/interview/InterviewWorkspace';

export default function InterviewPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useState(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setIsLoading(false);
    };
    checkAuth();
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivoire-50 flex items-center justify-center">
        <div className="text-ink-600">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect('/login');
  }

  return <InterviewWorkspace />;
}
