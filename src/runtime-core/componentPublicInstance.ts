import { hasOwn } from './../shared/index';
const ProxyPropertiesMap = {
  $el: (i) => i.vnode.el,
};

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState, props } = instance;
    if (hasOwn(setupState, key)) return setupState[key]; // 优先取setup
    else if (hasOwn(props, key)) return props[key]; // 其次取props

    // 最后处理$xxx属性
    const fn = ProxyPropertiesMap[key];
    if (fn) return fn(instance);
  },
};
