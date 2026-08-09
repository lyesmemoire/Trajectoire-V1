// Setup file pour Vitest - définit les variables d'environnement avant l'importation des modules
process.env.VITEST = "true";
(process.env as any).NODE_ENV = "test";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
process.env.OPENAI_API_KEY = "sk-test-key-12345678901234567890";
process.env.MISTRAL_API_KEY = "test-mistral-key";
process.env.STRIPE_SECRET_KEY = "sk-test-stripe-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
