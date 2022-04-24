import { isObject } from './../shared/index';
import { hasChange } from '../shared';
import { trackEffects, triggerEffects } from './effect';
import { reactive } from './reactive';

class RefImpl {
  private _value;
  public dep;
  private _raw; // 原始值
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
