// @ts-nocheck
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { SubscriptionRepositoryPort } from "../../ports/repositories/SubscriptionRepositoryPort";
import { SubscriptionAggregate } from "../../domain/aggregates/subscription.aggregate";
import { Plan, SubscriptionStatus, BillingPeriod } from "../../domain";
import prisma from "@/lib/prisma";
import { Clock } from "@/lib/core/clock/Clock";

export class PrismaSubscriptionRepository implements SubscriptionRepositoryPort {
  constructor(private readonly clock: Clock) {}
  async save(subscription: SubscriptionAggregate): Promise<Result<void>> {
    try {
      await prisma.subscription.upsert({
        where: { userId: subscription.userId },
        update: {
          stripeCustomerId: subscription.stripeCustomerId,
          stripeSubId: subscription.stripeSubId,
          status: subscription.status.value,
          currentPeriodEnd: subscription.period.end,
          plan: subscription.plan.value,
          updatedAt: new Date(),
        },
        create: {
          id: subscription.id,
          userId: subscription.userId,
          stripeCustomerId: subscription.stripeCustomerId,
          stripeSubId: subscription.stripeSubId,
          status: subscription.status.value,
          currentPeriodEnd: subscription.period.end,
          plan: subscription.plan.value,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to save subscription: ${error.message}`));
    }
  }

  async findByUserId(userId: string): Promise<Result<SubscriptionAggregate | null>> {
    try {
      const record = await prisma.subscription.findUnique({
        where: { userId }
      });

      if (!record) return ok(null);

      const aggregate = SubscriptionAggregate.create(record.id, {
        userId: record.userId,
        stripeCustomerId: record.stripeCustomerId,
        stripeSubId: record.stripeSubId,
        plan: Plan.create(record.plan),
        status: SubscriptionStatus.create(record.status),
        period: BillingPeriod.create(record.createdAt, record.currentPeriodEnd),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
      }, this.clock);

      return ok(aggregate);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to find subscription by user id: ${error.message}`));
    }
  }

  async findByStripeSubId(stripeSubId: string): Promise<Result<SubscriptionAggregate | null>> {
    try {
      const record = await prisma.subscription.findUnique({
        where: { stripeSubId }
      });

      if (!record) return ok(null);

      const aggregate = SubscriptionAggregate.create(record.id, {
        userId: record.userId,
        stripeCustomerId: record.stripeCustomerId,
        stripeSubId: record.stripeSubId,
        plan: Plan.create(record.plan),
        status: SubscriptionStatus.create(record.status),
        period: BillingPeriod.create(record.createdAt, record.currentPeriodEnd),
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
      }, this.clock);

      return ok(aggregate);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to find subscription by stripe sub id: ${error.message}`));
    }
  }
}
