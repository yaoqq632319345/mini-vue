import { proxyRefs } from '../reactivity';
import { shallowReadonly } from '../reactivity/reactive';
import { emit } from './componentEmits';
import { initProps } from './componentProps';
import { PublicInstanceProxyHandlers } from './componentPublicInstance';
import { initSlots } from './componentSlots';
export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {},
    slots: {},
    provides: parent ? parent.provides : {},
    next: null,
    subTree: {},
    isMounted: false,
    parent,
  };
  component.emit = emit.bind(null, component) as any;
  return component;
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);

  const setupResult = setupStatefulComponent(instance);
}
function setupStatefulComponent(instance: any) {
  const {
    type: { setup },
  } = instance;

  // 创建组件实例代理对象，之后在调用this.xxx时返回需要的数据
  instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers);

  if (setup) {
    setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  } else {
    finishComponentSetup(instance);
  }
}
function handleSetupResult(instance, setupResult: any) {
  // TODO 如果setup返回function

  if (typeof setupResult === 'object') {
    instance.setupState = proxyRefs(setupResult);
  }

  finishComponentSetup(instance);
}
function finishComponentSetup(instance: any) {
  const {
    type: { render },
  } = instance;
  if (render) {
    instance.render = render;
  }
}

let currentInstance: any = null;
export function getCurrentInstance() {
  return currentInstance;
}
function setCurrentInstance(instance) {
  currentInstance = instance;
}
