import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Container, ServiceTokens } from "@/infrastructure/di";
import { initializeContainer } from "@/infrastructure/di/bootstrap";
import { SimulationService } from "@/application/services";
import { AuthenticationError, ValidationError } from "@/core/errors";
import { ApiResponseBuilder } from "@/core/http";
import { EndSessionSchema } from "@/validation";

export async function POST(request: NextRequest) {
  try {
    // Initialize DI container
    initializeContainer();

    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return ApiResponseBuilder.unauthorized();
    }

    // Parse form data
    const formData = await request.formData();
    const rawData = {
      sessionId: formData.get("sessionId") as string,
    };

    // Validate with Zod
    const validationResult = EndSessionSchema.safeParse(rawData);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const validationFields: Array<{ field: string; message: string }> = [];
      
      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (messages && messages.length > 0) {
          validationFields.push({ field, message: messages[0] });
        }
      }
      
      throw new ValidationError("Invalid input data", validationFields);
    }

    const validatedData = validationResult.data;

    // Resolve service
    const simulationService = await Container.resolve(ServiceTokens.SimulationService) as SimulationService;

    // Execute command
    await simulationService.endSession(validatedData.sessionId, user.id);

    // Generate report
    const reportResponse = await fetch(new URL("/api/report/generate", request.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": request.headers.get("cookie") || "",
      },
      body: JSON.stringify({ sessionId: validatedData.sessionId }),
    });

    if (!reportResponse.ok) {
      // Still redirect to dashboard even if report fails
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const reportData = await reportResponse.json();
    
    // Redirect to report page
    return NextResponse.redirect(new URL(`/report/${reportData.data.reportId}`, request.url));
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return ApiResponseBuilder.unauthorized();
    }

    return ApiResponseBuilder.fromError(error);
  }
}
