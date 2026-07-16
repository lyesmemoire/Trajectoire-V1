// @ts-nocheck
export interface HttpRequest<TBody = unknown> {
  readonly body: TBody;
  readonly params: Record<string, string>;
  readonly headers: Record<string, string | undefined>;
}

export interface HttpResponse<TData = unknown> {
  readonly status: number;
  readonly body: TData;
}

export interface HealthCheckResponse {
  readonly status: "ok" | "degraded";
  readonly version: string;
  readonly uptime: number;
  readonly providers: {
    readonly openai: boolean;
    readonly deepgram: boolean;
    readonly elevenlabs: boolean;
    readonly supabase: boolean;
  };
}
