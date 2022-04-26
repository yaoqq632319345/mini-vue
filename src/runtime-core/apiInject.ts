import { getCurrentInstance } from './component';

export function provide(key, value) {
  const instance = getCurrentInstance();
  if (instance) {
    let { provides } = instance;
    const parent = instance.parent;
    if (parent) {
      const { provides: parentProvides } = parent;
      if (parentProvides === provides) {
        provides = instance.provides = Object.create(parentProvides); // 已父级provides为原型
      }
    }

    provides[key] = value;
  }
}
export function inject(key, defaultValue) {
  const instance = getCurrentInstance();
  if (instance) {
    const { provides } = instance.parent;
    const value = provides[key];
    if (value) return value;
    if (typeof defaultValue === 'function') return defaultValue();
    return defaultValue;
  }
}
