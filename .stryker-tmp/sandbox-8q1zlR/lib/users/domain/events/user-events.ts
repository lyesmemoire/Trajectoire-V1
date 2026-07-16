// @ts-nocheck
import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";

export class UserRegistered extends BaseDomainEvent<{
  userId: string;
  email: string;
  ip?: string;
  fingerprint?: string;
  userAgent?: string;
}> {
  public readonly type = "UserRegistered";
  public readonly aggregateId: string;
  
  constructor(public readonly payload: { userId: string; email: string; ip?: string; fingerprint?: string; userAgent?: string }) {
    super();
    this.aggregateId = payload.userId;
  }
}

export class UserProfileUpdated extends BaseDomainEvent<{
  userId: string;
  fullName: string | null;
  cvEditorCompleted: boolean;
}> {
  public readonly type = "UserProfileUpdated";
  public readonly aggregateId: string;

  constructor(public readonly payload: { userId: string; fullName: string | null; cvEditorCompleted: boolean }) {
    super();
    this.aggregateId = payload.userId;
  }
}

export class UserDeleted extends BaseDomainEvent<{
  userId: string;
}> {
  public readonly type = "UserDeleted";
  public readonly aggregateId: string;

  constructor(public readonly payload: { userId: string }) {
    super();
    this.aggregateId = payload.userId;
  }
}

export class AvatarChanged extends BaseDomainEvent<{
  userId: string;
  avatarUrl: string;
}> {
  public readonly type = "AvatarChanged";
  public readonly aggregateId: string;

  constructor(public readonly payload: { userId: string; avatarUrl: string }) {
    super();
    this.aggregateId = payload.userId;
  }
}

export class PlanChanged extends BaseDomainEvent<{
  userId: string;
  newPlan: string;
  previousPlan?: string;
}> {
  public readonly type = "PlanChanged";
  public readonly aggregateId: string;

  constructor(public readonly payload: { userId: string; newPlan: string; previousPlan?: string }) {
    super();
    this.aggregateId = payload.userId;
  }
}
