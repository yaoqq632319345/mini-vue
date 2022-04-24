import { track, trigger } from './effect';
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
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
export const readonlyHandlers = {
  get: readonlyGet,
  set() {
    console.warn(`不允许修改只读数据`);
    return true;
  },
};
