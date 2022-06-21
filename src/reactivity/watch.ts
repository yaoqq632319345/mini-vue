import { ReactiveEffect } from './effect';

export const watch = (getter, fn) => {
  const runner = new ReactiveEffect(getter, fn);
  runner.run();
};
