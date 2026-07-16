import { prisma } from "@/lib/prisma";
import { Clock } from "@/lib/core/clock/Clock";
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { JobOfferAggregate } from "../../domain/aggregates/job-offer.aggregate";

export class PrismaJobOfferRepository {
  constructor(private readonly clock: Clock) {}

  async save(aggregate: JobOfferAggregate): Promise<Result<void>> {
    try {
      await (prisma as any).jobOffer.upsert({
        where: { id: aggregate.id },
        create: {
          id: aggregate.id,
          userId: aggregate.userId,
          title: aggregate.props.title,
          company: aggregate.props.company,
          description: aggregate.props.description,
          source: aggregate.props.source,
          sourceType: aggregate.props.sourceType,
          metadata: aggregate.props.metadata as any,
        },
        update: {
          title: aggregate.props.title,
          company: aggregate.props.company,
          description: aggregate.props.description,
          source: aggregate.props.source,
          sourceType: aggregate.props.sourceType,
          metadata: aggregate.props.metadata as any,
          updatedAt: this.clock.now(),
        },
      });

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to save job offer: ${error.message}`));
    }
  }

  async findById(id: string): Promise<Result<JobOfferAggregate>> {
    try {
      const jobOffer = await (prisma as any).jobOffer.findUnique({
        where: { id },
      });

      if (!jobOffer) {
        return fail(new InfrastructureError("Job offer not found"));
      }

      return ok(JobOfferAggregate.load({
        id: jobOffer.id,
        userId: jobOffer.userId,
        title: jobOffer.title,
        company: jobOffer.company,
        description: jobOffer.description,
        source: jobOffer.source,
        sourceType: jobOffer.sourceType as any,
        metadata: jobOffer.metadata as any,
        createdAt: jobOffer.createdAt,
        updatedAt: jobOffer.updatedAt,
      }, this.clock));
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to find job offer: ${error.message}`));
    }
  }

  async findByUserId(userId: string): Promise<Result<JobOfferAggregate[]>> {
    try {
      const jobOffers = await (prisma as any).jobOffer.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      return ok(jobOffers.map((jo: any) => JobOfferAggregate.load({
        id: jo.id,
        userId: jo.userId,
        title: jo.title,
        company: jo.company,
        description: jo.description,
        source: jo.source,
        sourceType: jo.sourceType as any,
        metadata: jo.metadata as any,
        createdAt: jo.createdAt,
        updatedAt: jo.updatedAt,
      }, this.clock)));
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to list job offers: ${error.message}`));
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await (prisma as any).jobOffer.delete({
        where: { id },
      });

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Failed to delete job offer: ${error.message}`));
    }
  }
}
