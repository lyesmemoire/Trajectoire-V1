// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { CareerUpdateSchema } from "@/lib/career/application/dto/career-update.dto";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { UpdateCareerProfileUseCase } from "@/lib/career/application/use-cases/update-career-profile/update-career-profile.use-case";
import { CareerPresenter } from "@/lib/career/presentation/career.presenter";
import { Pipeline } from "@/lib/core/runtime/pipeline/Pipeline";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { envServer } from "@/lib/env.server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Check if Supabase is configured
  if (!envServer.NEXT_PUBLIC_SUPABASE_URL || !envServer.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: "Service unavailable - configuration missing" },
      { status: 503 }
    );
  }

  // 1. Validation
  const user = await getStrictUser(req);
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const parsed = CareerUpdateSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres invalides.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // 2. RequestContext.run()
  const requestId = crypto.randomUUID();
  return RequestContext.run({ userId: user.id, requestId, correlationId: requestId }, async () => {
    // 3. Pipeline.execute()
    const pipeline = new Pipeline<any, any>();
    
    const useCase = appContainer.resolve<UpdateCareerProfileUseCase>("UpdateCareerProfileUseCase");
    const presenter = appContainer.resolve<CareerPresenter>("CareerPresenter");

    const result = await pipeline.execute({ dto: parsed.data }, (input) => useCase.execute(input));

    // 4 & 5. Presenter & ErrorHttpMapper
    const { status, body } = presenter.presentUpdateProfile(result);
    return NextResponse.json(body, { status });
  });
}
