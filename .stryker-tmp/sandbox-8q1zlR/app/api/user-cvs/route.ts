// @ts-nocheck
import { createApiHandler } from "@/lib/core/api/handler";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { ListUserCvsQueryHandler } from "@/lib/cv/application/queries/list-user-cvs.query";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";

export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  requireAuth: true,
  handler: async ({ user }) => {
    return RequestContext.run(
      { userId: user!.id, correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
      async () => {
        const handler = appContainer.resolve<ListUserCvsQueryHandler>("ListUserCvsQueryHandler");
        
        const result = await handler.execute({ type: "ListUserCvsQuery" });

        if (result.isFailure()) {
          throw result.unwrapError();
        }

        return result.unwrap();
      }
    );
  }
});
