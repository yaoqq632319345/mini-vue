import { extend } from './../shared/index';
export class ReactiveEffect {
  private _fn: Function;
  deps = [];
  active = true;
  onStop?;
  constructor(fn: Function, public scheduler?) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
  stop() {
    if (this.active) {
      cleanUpEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanUpEffect(effect) {
  effect.deps.forEach((dep) => {
    (dep as Set<ReactiveEffect>).delete(effect);
  });

  effect.deps.length = 0;
}
let activeEffect;
const targetMap = new WeakMap();
export function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set<ReactiveEffect>();
    depsMap.set(key, dep);
  }
  if (!activeEffect) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}
export function trigger(target, key) {
  const dep = targetMap.get(target).get(key);

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
export function effect(fn: Function, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  // _effect.onStop = options.onStop
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
