import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { GetCareerProfileQuery, GetCareerProfileQueryHandler } from "@/lib/career/application/queries/get-career-profile.query";

function apiResponse(success: boolean, data: any = null, error: string | null = null) {
  return { success, data, error };
}

export async function GET(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json(apiResponse(false, null, "Unauthorized"), { status: 401 });
    }

    const handler = new GetCareerProfileQueryHandler();
    const query = new GetCareerProfileQuery();
    const result = await handler.execute(query);

    if (result.isFailure()) {
      return NextResponse.json(apiResponse(false, null, result.unwrapError().message), { status: 500 });
    }

    const profile = result.unwrap();
    
    // Transform to the format expected by the UI
    const profileData = profile ? {
      id: profile.id,
      userId: profile.userId,
      name: user.user_metadata?.name || user.email,
      email: user.email,
      phone: user.user_metadata?.phone || null,
      targetRole: profile.targetRole,
      targetCompany: profile.targetCompany,
      targetIndustry: profile.targetIndustry,
      currentRole: profile.currentRole,
      currentCompany: profile.currentCompany,
      currentIndustry: profile.currentIndustry,
      careerScore: profile.careerScore,
      readinessLevel: profile.readinessLevel,
      experience: [], // Would need to be populated from CV data
      skills: [], // Would need to be populated from CV data
    } : {
      id: null,
      userId: user.id,
      name: user.user_metadata?.name || user.email,
      email: user.email,
      phone: user.user_metadata?.phone || null,
      targetRole: null,
      targetCompany: null,
      targetIndustry: null,
      currentRole: null,
      currentCompany: null,
      currentIndustry: null,
      careerScore: null,
      readinessLevel: null,
      experience: [],
      skills: [],
    };

    return NextResponse.json(apiResponse(true, profileData));
  } catch (error: any) {
    return NextResponse.json(apiResponse(false, null, "Internal Server Error"), { status: 500 });
  }
}
