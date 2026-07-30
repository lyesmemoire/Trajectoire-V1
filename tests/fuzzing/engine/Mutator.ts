export class Mutator {
  private weights = {
    bitflip: 10,
    byteflip: 10,
    chunkInsert: 5,
    chunkDelete: 5,
    dictionary: 5
  };
  private memory = new Map<string, number>();

  constructor(private dictionary: Uint8Array[] = []) {}

  mutate(input: Uint8Array): { mutated: Uint8Array; strategy: string } {
    if (input.length === 0) {
      return { mutated: new Uint8Array([0]), strategy: 'chunkInsert' };
    }

    const totalWeight = Object.values(this.weights).reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalWeight;
    
    let strategy = 'bitflip';
    for (const [strat, weight] of Object.entries(this.weights)) {
      if (rand < weight) {
        strategy = strat;
        break;
      }
      rand -= weight;
    }

    const output = new Uint8Array(input);
    const pos = Math.floor(Math.random() * output.length);

    switch (strategy) {
      case 'bitflip':
        output[pos] ^= (1 << Math.floor(Math.random() * 8));
        return { mutated: output, strategy };
      case 'byteflip':
        output[pos] = Math.floor(Math.random() * 256);
        return { mutated: output, strategy };
      case 'chunkInsert': {
        const insertLen = Math.floor(Math.random() * 16) + 1;
        const newBuf = new Uint8Array(output.length + insertLen);
        newBuf.set(output.subarray(0, pos), 0);
        for (let i = 0; i < insertLen; i++) newBuf[pos + i] = Math.floor(Math.random() * 256);
        newBuf.set(output.subarray(pos), pos + insertLen);
        return { mutated: newBuf, strategy };
      }
      case 'chunkDelete': {
        if (output.length <= 1) return { mutated: output, strategy: 'none' };
        const delLen = Math.min(Math.floor(Math.random() * 16) + 1, output.length - pos);
        const newBuf = new Uint8Array(output.length - delLen);
        newBuf.set(output.subarray(0, pos), 0);
        newBuf.set(output.subarray(pos + delLen), pos);
        return { mutated: newBuf, strategy };
      }
      case 'dictionary': {
        if (this.dictionary.length === 0) return { mutated: output, strategy: 'none' };
        const word = this.dictionary[Math.floor(Math.random() * this.dictionary.length)];
        const newBuf = new Uint8Array(output.length + word.length);
        newBuf.set(output.subarray(0, pos), 0);
        newBuf.set(word, pos);
        newBuf.set(output.subarray(pos), pos + word.length);
        return { mutated: newBuf, strategy };
      }
      default:
        return { mutated: output, strategy: 'none' };
    }
  }

  feedback(strategy: string, success: boolean) {
    if (!this.weights[strategy as keyof typeof this.weights]) return;
    const key = strategy as keyof typeof this.weights;
    if (success) {
      this.weights[key] += 1;
    } else {
      this.weights[key] = Math.max(1, this.weights[key] - 0.1);
    }
  }

  getStatistics() {
    return this.weights;
  }
}
