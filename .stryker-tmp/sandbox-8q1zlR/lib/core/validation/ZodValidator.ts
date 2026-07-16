// @ts-nocheck
import { z } from "zod";
import { Validator } from "./Validator";
import { Result } from "../result/Result";
import { ValidationError } from "../result/errors";
import { ok, fail } from "../result";

export class ZodValidator<T, Input = unknown> implements Validator<T, Input> {
  constructor(private readonly schema: z.ZodSchema<T>) {}

  validate(data: Input): Result<T, ValidationError> {
    const parsed = this.schema.safeParse(data);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return fail(
        new ValidationError("Validation failed", { issues: errors })
      );
    }
    return ok(parsed.data);
  }
}
