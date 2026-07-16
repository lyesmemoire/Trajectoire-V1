import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { createJourneyUseCase } from "@/modules/candidate-journey/composition/journey.factory";
import { UploadCvInput } from "@/lib/cv/application/use-cases/upload/upload-cv.use-case";
import { UploadJobOfferInput } from "@/lib/jobs/application/use-cases/upload/upload-job-offer.use-case";
import { RewriteCvInput } from "@/lib/cv/application/use-cases/rewrite/rewrite-cv.use-case";
import { StartInterviewCommand } from "@/lib/interview/application/use-cases/start-interview/start-interview.use-case";

function apiResponse(success: boolean, data: any = null, error: string | null = null) {
  return { success, data, error };
}

// POST /api/journey - Start or advance journey
export async function POST(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const body = await req.json();
    const { action, journeyId, stepData } = body;

    const journeyUseCase = createJourneyUseCase();

    if (action === "start") {
      const result = await journeyUseCase.execute({ userId: user.id });
      if (result.isFailure()) {
        return NextResponse.json(apiResponse(false, null, result.unwrapError().message), { status: 500 });
      }
      return NextResponse.json(apiResponse(true, result.unwrap()));
    }

    if (action === "uploadCv" && journeyId) {
      const input: UploadCvInput = stepData;
      const result = await journeyUseCase.uploadCv(journeyId, input);
      if (result.isFailure()) {
        return NextResponse.json(apiResponse(false, null, result.unwrapError().message), { status: 500 });
      }
      return NextResponse.json(apiResponse(true, { success: true }));
    }

    if (action === "updateCareerProfile" && journeyId) {
      const result = await journeyUseCase.updateCareerProfile(journeyId);
      if (result.isFailure()) {
        return NextResponse.json(apiResponse(false, null, result.unwrapError().message), { status: 500 });
      }
      return NextResponse.json(apiResponse(true, { success: true }));
    }

    if (action === "uploadJobOffer" && journeyId) {
      const input: UploadJobOfferInput = stepData;
      const result = await journeyUseCase.uploadJobOffer(journeyId, input);
      if (result.isFailure()) {
        return NextResponse.json(apiResponse(false, null, result.unwrapError().message), { status: 500 });
      }
      return NextResponse.json(apiResponse(true, { success: true }));
    }

    if (action === "analyzeAts" && journeyId) {
      const { cvText } = stepData;
      const result = await journeyUseCase.analyzeAts(journeyId, cvText);
      if (result.isFailure()) {
        return NextResponse.json(apiResponse(false, null, result.unwrapError().message), { status: 500 });
      }
      return NextResponse.json(apiResponse(true, { success: true }));
    }

    if (action === "optimizeCv" && journeyId) {
      const result = await journeyUseCase.optimizeCv(journeyId);
      if (result.isFailure()) {
        return NextResponse.json(apiResponse(false, null, result.unwrapError().message), { status: 500 });
      }
      return NextResponse.json(apiResponse(true, { success: true }));
    }

    if (action === "startInterview" && journeyId) {
      const input: StartInterviewCommand = stepData;
      const result = await journeyUseCase.startInterview(journeyId, input);
      if (result.isFailure()) {
        return NextResponse.json(apiResponse(false, null, result.unwrapError().message), { status: 500 });
      }
      return NextResponse.json(apiResponse(true, { success: true }));
    }

    if (action === "generateFinalReport" && journeyId) {
      const result = await journeyUseCase.generateFinalReport(journeyId);
      if (result.isFailure()) {
        return NextResponse.json(apiResponse(false, null, result.unwrapError().message), { status: 500 });
      }
      return NextResponse.json(apiResponse(true, { success: true }));
    }

    return NextResponse.json(apiResponse(false, null, "Invalid action"), { status: 400 });
  } catch (error: any) {
    console.error("[Journey API] Error", error);
    return NextResponse.json(apiResponse(false, null, "Internal Server Error"), { status: 500 });
  }
}

// GET /api/journey - Get journey status
export async function GET(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const journeyId = searchParams.get("journeyId");

    if (!journeyId) {
      return NextResponse.json(apiResponse(false, null, "journeyId required"), { status: 400 });
    }

    const journeyUseCase = createJourneyUseCase();
    const result = await journeyUseCase.getJourney(journeyId);

    if (result.isFailure()) {
      return NextResponse.json(apiResponse(false, null, result.unwrapError().message), { status: 404 });
    }

    const journey = result.unwrap();
    const responseData = journey.toResponse();

    return NextResponse.json(apiResponse(true, responseData));
  } catch (error: any) {
    console.error("[Journey API] Error", error);
    return NextResponse.json(apiResponse(false, null, "Internal Server Error"), { status: 500 });
  }
}

// PATCH /api/journey - Resume interrupted journey
export async function PATCH(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const body = await req.json();
    const { journeyId, action } = body;

    if (!journeyId) {
      return NextResponse.json(apiResponse(false, null, "journeyId required"), { status: 400 });
    }

    const journeyUseCase = createJourneyUseCase();

    if (action === "resume") {
      const result = await journeyUseCase.getJourney(journeyId);
      if (result.isFailure()) {
        return NextResponse.json(apiResponse(false, null, result.unwrapError().message), { status: 404 });
      }

      const journey = result.unwrap();
      const responseData = journey.toResponse();
      
      return NextResponse.json(apiResponse(true, {
        ...responseData,
        canResume: journey.status === "IN_PROGRESS",
      }));
    }

    return NextResponse.json(apiResponse(false, null, "Invalid action"), { status: 400 });
  } catch (error: any) {
    console.error("[Journey API] Error", error);
    return NextResponse.json(apiResponse(false, null, "Internal Server Error"), { status: 500 });
  }
}
