export class ReactiveEffect {
  private _fn: Function;
  constructor(fn: Function, public scheduler?) {
    this._fn = fn;
  }
  run() {
    activeEffect = this
    return this._fn();
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
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}
export function effect(fn: Function, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run();

  return _effect.run.bind(_effect)
}
