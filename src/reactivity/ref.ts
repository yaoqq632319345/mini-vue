import { isObject } from './../shared/index';
import { hasChange } from '../shared';
import { trackEffects, triggerEffects } from './effect';
import { reactive } from './reactive';

class RefImpl {
  private _value;
  public dep;
  private _raw; // 原始值
  public __v_isRef = true;
  constructor(value) {
    this._raw = value;
    this._value = convert(value);
    this.dep = new Set();
  }
  get value() {
    trackEffects(this.dep);
    return this._value;
  }
  set value(newValue) {
    if (hasChange(newValue, this._raw)) {
      this._raw = newValue;
      this._value = convert(newValue);
      triggerEffects(this.dep);
    }
  }
}
function convert(val) {
  return isObject(val) ? reactive(val) : val;
}
export function ref(value) {
  return new RefImpl(value);
}

export function isRef(val) {
  return !!val['__v_isRef'];
}
export function unRef(val) {
  return isRef(val) ? val.value : val;
}
export function proxyRefs(raw) {
  return new Proxy(raw, {
    get(target, key) {
      return unRef(Reflect.get(target, key)); // 直接解包
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
