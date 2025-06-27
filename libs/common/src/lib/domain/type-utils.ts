export type PlainClass<C> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof C as C[K] extends Function ? never : K]: C[K];
};
