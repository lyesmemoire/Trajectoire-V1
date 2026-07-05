import { UseCase, Result, fail, ok } from "@/lib/core";
import { AvatarStoragePort } from "../../ports/avatar-storage.port";
import { EventBus } from "@/lib/core/events/event-bus";
import { AvatarChanged } from "../../domain/events/user-events";

export interface UpdateAvatarInput {
  userId: string;
  fileBuffer: Buffer;
  filename: string;
}

export class UpdateAvatarUseCase extends UseCase<UpdateAvatarInput, string> {
  constructor(
    private avatarStorage: AvatarStoragePort,
    private eventBus: EventBus
  ) {
    super();
  }

  protected async beforeExecute(): Promise<void> {}

  protected async run(input: UpdateAvatarInput): Promise<Result<string>> {
    const uploadResult = await this.avatarStorage.uploadAvatar(input.userId, input.fileBuffer, input.filename);
    if (uploadResult.isFailure()) return fail(uploadResult.unwrapError());
    
    return ok(uploadResult.unwrap());
  }

  protected async afterExecute(input: UpdateAvatarInput, result: Result<string>): Promise<void> {
    if (result.isSuccess()) {
      this.eventBus.publish(new AvatarChanged({
        userId: input.userId,
        avatarUrl: result.unwrap()
      }));
    }
  }
}
