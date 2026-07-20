import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Container, ServiceTokens } from "@/infrastructure/di";
import { initializeContainer } from "@/infrastructure/di/bootstrap";
import { AccountService } from "@/application/services";
import { AuthenticationError } from "@/core/errors";
import { ApiResponseBuilder } from "@/core/http";

export async function POST() {
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
    await accountService.deleteAccount({ userId: user.id });

    return ApiResponseBuilder.success({ success: true });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return ApiResponseBuilder.unauthorized();
    }

    return ApiResponseBuilder.fromError(error);
  }
}
