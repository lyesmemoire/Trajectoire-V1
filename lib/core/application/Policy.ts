export interface Policy<TInput = unknown> {
  evaluate(input: TInput): boolean;
}
