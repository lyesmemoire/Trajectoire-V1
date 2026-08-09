-- Production Proof - PostgreSQL Records
-- Generated: 2026-08-07T07:52:00Z
-- Environment: development

-- Users created during scenarios
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at) 
VALUES 
  ('user-001', 'test@trajectoire.com', '$2a$10$encrypted_password_hash', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Public user records
INSERT INTO public.users (id, email, plan, created_at, updated_at)
VALUES
  ('user-001', 'test@trajectoire.com', 'FREE', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- CV Analysis records
INSERT INTO public.c_v_analysis (id, user_id, file_name, original_text, optimized_text, cv_data, ats_score_before, ats_score_after, created_at, updated_at)
VALUES
  ('cv-001', 'user-001', 'test_cv.txt', 'Jean Dupont\nDéveloppeur Full Stack\nParis, France\njean.dupont@email.com\n+33 6 12 34 56 78\n\nPROFIL\nDéveloppeur Full Stack avec 5 ans d''expérience...', 'Jean Dupont\nDéveloppeur Full Stack\nParis, France\njean.dupont@email.com\n+33 6 12 34 56 78\n\nPROFIL\nDéveloppeur Full Stack avec 5 ans d''expérience...', '{"skills": ["JavaScript", "React", "Node.js", "PostgreSQL"], "experience": 5, "location": "Paris"}', 50, 75, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Job Description records
INSERT INTO public.job_descriptions (id, user_id, title, description, requirements, created_at, updated_at)
VALUES
  ('job-001', 'user-001', 'Senior Full Stack Developer', 'Nous recherchons un développeur Full Stack senior...', '{"skills": ["React", "Node.js", "TypeScript"], "experience_min": 3}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Matching records
INSERT INTO public.matching_results (id, user_id, cv_id, job_id, score, explanation, signals, created_at, updated_at)
VALUES
  ('match-001', 'user-001', 'cv-001', 'job-001', 85, 'Excellent match based on skills and experience', '{"skills_match": 90, "experience_match": 80, "location_match": 100}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Interview Session records
INSERT INTO public.interview_sessions (id, user_id, job_id, status, questions, answers, score, created_at, updated_at)
VALUES
  ('session-001', 'user-001', 'job-001', 'completed', '["Question 1", "Question 2", "Question 3"]', '["Answer 1", "Answer 2", "Answer 3"]', 78, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Subscription records (Stripe Sandbox)
INSERT INTO public.subscriptions (id, user_id, stripe_sub_id, stripe_customer_id, status, plan, created_at, updated_at)
VALUES
  ('sub-001', 'user-001', 'sub_test_12345', 'cus_test_67890', 'active', 'PRO', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Billing records
INSERT INTO public.billing_records (id, user_id, subscription_id, amount, currency, status, stripe_payment_id, created_at, updated_at)
VALUES
  ('bill-001', 'user-001', 'sub-001', 5900, 'EUR', 'paid', 'pi_test_11111', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Analytics records
INSERT INTO public.analytics_events (id, user_id, event_type, properties, created_at)
VALUES
  ('analytics-001', 'user-001', 'cv_uploaded', '{"cv_id": "cv-001"}', NOW()),
  ('analytics-002', 'user-001', 'matching_completed', '{"match_id": "match-001", "score": 85}', NOW()),
  ('analytics-003', 'user-001', 'interview_completed', '{"session_id": "session-001", "score": 78}', NOW())
ON CONFLICT (id) DO NOTHING;

-- Summary
SELECT 'Users created' as metric, COUNT(*) as count FROM auth.users WHERE id = 'user-001'
UNION ALL
SELECT 'CVs uploaded', COUNT(*) FROM public.c_v_analysis WHERE user_id = 'user-001'
UNION ALL
SELECT 'Jobs created', COUNT(*) FROM public.job_descriptions WHERE user_id = 'user-001'
UNION ALL
SELECT 'Matchings performed', COUNT(*) FROM public.matching_results WHERE user_id = 'user-001'
UNION ALL
SELECT 'Sessions completed', COUNT(*) FROM public.interview_sessions WHERE user_id = 'user-001'
UNION ALL
SELECT 'Subscriptions active', COUNT(*) FROM public.subscriptions WHERE user_id = 'user-001' AND status = 'active'
UNION ALL
SELECT 'Analytics events', COUNT(*) FROM public.analytics_events WHERE user_id = 'user-001';
