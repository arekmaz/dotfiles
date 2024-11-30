export function invariant (a:any, msg: string): asserts a {
  const prefix = 'Invariant Error: ';

  if (a) {
    return;
  }

  throw new Error(`${prefix}${msg}`);
};

