import { Result } from "../result/Result";
import { ValidationError } from "../result/errors";

export interface Validator<T, Input = unknown> {
  validate(data: Input): Result<T, ValidationError>;
}
