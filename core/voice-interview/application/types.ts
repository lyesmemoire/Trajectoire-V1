export type Success<T> = { readonly isSuccess: true; readonly isFailure: false; readonly value: T };
export type Failure<E> = { readonly isSuccess: false; readonly isFailure: true; readonly error: E };
export type Result<T, E> = Success<T> | Failure<E>;

export const success = <T>(value: T): Success<T> => Object.freeze({ isSuccess: true, isFailure: false, value });
export const failure = <E>(error: E): Failure<E> => Object.freeze({ isSuccess: false, isFailure: true, error });

export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> => result.isSuccess;
export const isFailure = <T, E>(result: Result<T, E>): result is Failure<E> => result.isFailure;

export interface UseCase<TRequest, TResponse, TError> {
  execute(request: TRequest, context: CommandContext): Promise<Result<TResponse, TError>>;
}

export interface CommandContext {
  readonly correlationId: string;
  readonly userId?: string;
  readonly timestamp: Date;
}

export abstract class ApplicationError extends Error {
  public readonly code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
