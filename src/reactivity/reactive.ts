import { readonlyHandlers, mutableHandlers } from './handlers';

export function reactive(raw) {
  return new Proxy(raw, mutableHandlers);
}

export function readonly(raw) {
  return new Proxy(raw, readonlyHandlers);
}
