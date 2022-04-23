export class ReactiveEffect {
  private _fn: Function;
  constructor(fn: Function) {
    this._fn = fn;
  }
  run() {
    activeEffect = this
    this._fn();
  }
}
let activeEffect
const targetMap = new WeakMap();
export function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}
export function trigger(target, key) {
  const dep = targetMap.get(target).get(key)

  for (const effect of dep) {
    effect.run()
  }
}
export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
