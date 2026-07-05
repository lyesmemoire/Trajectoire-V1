import { AggregateRoot } from "@/lib/core/domain/AggregateRoot";
import { Plan } from "../value-objects/plan.vo";
import { SubscriptionStatus } from "../value-objects/subscription-status.vo";
import { BillingPeriod } from "../value-objects/billing-period.vo";
import { BaseDomainEvent } from "@/lib/core/events/domain/BaseDomainEvent";
import { Clock } from "@/lib/core/clock/Clock";

export class SubscriptionActivated extends BaseDomainEvent<{ userId: string; plan: string }> {
  public readonly type = "billing.subscription.activated";
  constructor(public readonly aggregateId: string, public readonly payload: { userId: string; plan: string }) {
    super();
  }
}

export class SubscriptionCanceled extends BaseDomainEvent<{ userId: string }> {
  public readonly type = "billing.subscription.canceled";
  constructor(public readonly aggregateId: string, public readonly payload: { userId: string }) {
    super();
  }
}

interface SubscriptionProps {
  userId: string;
  stripeCustomerId: string;
  stripeSubId: string;
  plan: Plan;
  status: SubscriptionStatus;
  period: BillingPeriod;
  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionAggregate extends AggregateRoot {
  private constructor(
    public readonly id: string,
    private _props: SubscriptionProps,
    private readonly clock: Clock
  ) {
    super();
  }

  static create(id: string, props: SubscriptionProps, clock: Clock): SubscriptionAggregate {
    return new SubscriptionAggregate(id, props, clock);
  }

  public get userId() { return this._props.userId; }
  public get plan() { return this._props.plan; }
  public get status() { return this._props.status; }
  public get period() { return this._props.period; }
  public get stripeCustomerId() { return this._props.stripeCustomerId; }
  public get stripeSubId() { return this._props.stripeSubId; }

  public isActive(): boolean {
    return this._props.status.isActive && this._props.period.isActive(this.clock.now());
  }

  public changePlan(newPlan: Plan, newPeriod: BillingPeriod): void {
    if (this._props.plan.value === newPlan.value) {
      throw new Error("Cannot change to the same plan.");
    }
    
    this._props.plan = newPlan;
    this._props.period = newPeriod;
    this._props.updatedAt = this.clock.now();

    this.recordEvent(new SubscriptionActivated(this.id, {
      userId: this.userId,
      plan: newPlan.value,
    }));
  }

  public cancel(): void {
    if (!this._props.status.isActive) {
      throw new Error("Subscription is not active.");
    }

    this._props.status = SubscriptionStatus.create("canceled");
    this._props.updatedAt = this.clock.now();

    this.recordEvent(new SubscriptionCanceled(this.id, {
      userId: this.userId
    }));
  }
}
