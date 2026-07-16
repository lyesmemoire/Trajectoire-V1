// @ts-nocheck
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiProvider {
  async *generateResponse(text: string): AsyncGenerator<string> {
    yield 'dummy response';
  }
}
