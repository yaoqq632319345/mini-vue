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
  return createReactiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}
export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers);
}
export function shallowReactive(raw) {
  return createReactiveObject(raw, shallowReativeHandlers);
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

export function createReactiveObject(target, baseHandlers) {
  if (isObject(target)) return new Proxy(target, baseHandlers);
  console.warn(`单值无法通过reactive 包装成响应式`);
  return target;
}
