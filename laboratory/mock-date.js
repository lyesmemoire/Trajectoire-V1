
  const FixedDate = class extends Date {
    constructor(...args) {
      if (args.length === 0) return new Date('2026-07-29T10:00:00Z');
      return super(...args);
    }
  };
  global.Date = FixedDate;
