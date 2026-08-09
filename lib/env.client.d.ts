import { z } from "zod";
declare const EnvClientSchema: z.ZodObject<{
    NEXT_PUBLIC_SUPABASE_URL: z.ZodString;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.ZodString;
    NEXT_PUBLIC_APP_URL: z.ZodString;
    NEXT_PUBLIC_POSTHOG_KEY: z.ZodOptional<z.ZodString>;
    NEXT_PUBLIC_POSTHOG_HOST: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.ZodOptional<z.ZodString>;
    NEXT_PUBLIC_GATEWAY_URL: z.ZodOptional<z.ZodString>;
    NEXT_PUBLIC_API_URL: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_POSTHOG_HOST: string;
    NEXT_PUBLIC_POSTHOG_KEY?: string | undefined;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string | undefined;
    NEXT_PUBLIC_GATEWAY_URL?: string | undefined;
    NEXT_PUBLIC_API_URL?: string | undefined;
}, {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_POSTHOG_KEY?: string | undefined;
    NEXT_PUBLIC_POSTHOG_HOST?: string | undefined;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string | undefined;
    NEXT_PUBLIC_GATEWAY_URL?: string | undefined;
    NEXT_PUBLIC_API_URL?: string | undefined;
}>;
export declare const envClient: {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_POSTHOG_HOST: string;
    NEXT_PUBLIC_POSTHOG_KEY?: string | undefined;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string | undefined;
    NEXT_PUBLIC_GATEWAY_URL?: string | undefined;
    NEXT_PUBLIC_API_URL?: string | undefined;
};
export type EnvClient = z.infer<typeof EnvClientSchema>;
export {};
//# sourceMappingURL=env.client.d.ts.map