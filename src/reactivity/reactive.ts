import { isObject } from './../shared/index';
import {
  readonlyHandlers,
  mutableHandlers,
  shallowReadonlyHandlers,
  shallowReativeHandlers,
} from './handlers';
export const enum ReactiveFlags {
  isReactive = '__v_isReactive',
  isReadonly = '__v_isReadonly',
}
export function reactive(raw) {
  if (isObject(raw)) return new Proxy(raw, mutableHandlers);
  console.warn(`单值无法通过reactive 包装成响应式`);
  return raw;
}

export function readonly(raw) {
  return new Proxy(raw, readonlyHandlers);
}
export function shallowReadonly(raw) {
  return new Proxy(raw, shallowReadonlyHandlers);
}
export function shallowReactive(raw) {
  return new Proxy(raw, shallowReativeHandlers);
}
export function isReactive(raw) {
  return !!raw[ReactiveFlags.isReactive];
}

export function isReadonly(raw) {
  return !!raw[ReactiveFlags.isReadonly];
}

export function isProxy(raw) {
  return isReactive(raw) || isReadonly(raw);
}
