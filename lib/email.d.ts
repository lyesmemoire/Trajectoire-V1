import { Resend } from "resend";
export declare function getResend(): Resend;
export declare function sendWelcomeEmail(to: string, name: string): Promise<import("resend").CreateEmailResponse>;
export declare function sendInterviewResultsEmail(to: string, score: number): Promise<{
    data: import("resend").CreateEmailResponseSuccess | null;
    error: import("resend").ErrorResponse | null;
}>;
//# sourceMappingURL=email.d.ts.map