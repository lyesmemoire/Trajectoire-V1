import { Container } from "../container/Container";

export interface Module {
  register(container: Container): void | Promise<void>;
}
