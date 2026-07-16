import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { createInterviewUseCase } from "@/lib/interview/composition/interview.factory";
/* eslint-disable no-restricted-imports -- the route is the explicit HTTP-to-stream boundary. */
import { InterviewStreamAdapter } from "@/lib/interview/infrastructure/adapters/interview-stream.adapter";
import { parseInterviewChatInput } from "@/lib/interview/presentation/validators/interview-conversation.schema";
import { ValidationError } from "@/lib/interview/domain/contracts/interview.errors";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const user = await getStrictUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const input = parseInterviewChatInput(await request.json());
    const useCase = createInterviewUseCase();

    return InterviewStreamAdapter.toResponse(useCase.execute(user.id, input));
  } catch (error) {
    if (error instanceof ValidationError || error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
