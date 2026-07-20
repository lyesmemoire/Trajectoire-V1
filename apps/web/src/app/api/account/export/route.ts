import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Container, ServiceTokens } from "@/infrastructure/di";
import { initializeContainer } from "@/infrastructure/di/bootstrap";
import { AccountService } from "@/application/services";
import { AuthenticationError } from "@/core/errors";
import { ApiResponseBuilder } from "@/core/http";

export async function GET() {
  try {
    // Initialize DI container
    initializeContainer();

    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return ApiResponseBuilder.unauthorized();
    }

    // Resolve service
    const accountService = await Container.resolve(ServiceTokens.AccountService) as AccountService;

    // Execute command
    const exportData = await accountService.exportAccountData({ userId: user.id });

    // Add user metadata
    const fullExportData = {
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      },
      ...exportData,
      export_date: new Date().toISOString(),
    };

    return ApiResponseBuilder.success(fullExportData);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return ApiResponseBuilder.unauthorized();
    }

    return ApiResponseBuilder.fromError(error);
  }
}
