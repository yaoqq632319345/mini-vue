import { extend } from './../shared/index';
import { isObject } from '../shared';
import { track, trigger } from './effect';
import { reactive, ReactiveFlags, readonly } from './reactive';
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const shallowReactiveGet = createGetter(false, true);
function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.isReactive) {
      return !isReadonly;
    } else if (key === ReactiveFlags.isReadonly) {
      return isReadonly;
    }

    const res = Reflect.get(target, key);
    // 如果是浅包装 则直接返回结果
    if (isShallow) {
      !isReadonly && track(target, key); // 收集依赖
      return res;
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    !isReadonly && track(target, key); // 收集依赖
    return res;
  };
}
function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    trigger(target, key); // 触发依赖
    return res;
  };
}

export const mutableHandlers = {
  get,
  set,
};
export const shallowReativeHandlers = extend({}, mutableHandlers, {
  get: shallowReactiveGet,
});
export const readonlyHandlers = {
  get: readonlyGet,
  set() {
    console.warn(`不允许修改只读数据`);
    return true;
  },
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
});
