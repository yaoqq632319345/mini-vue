import { readonlyHandlers, mutableHandlers } from './handlers';
export const enum ReactiveFlags {
  isReactive = '__v_isReactive',
  isReadonly = '__v_isReadonly',
}
export function reactive(raw) {
  return new Proxy(raw, mutableHandlers);
}

export function readonly(raw) {
  return new Proxy(raw, readonlyHandlers);
}

export function isReactive(raw) {
  return !!raw[ReactiveFlags.isReactive];
}

export function isReadonly(raw) {
  return !!raw[ReactiveFlags.isReadonly];
}
