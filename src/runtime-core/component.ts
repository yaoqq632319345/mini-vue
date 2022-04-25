import { shallowReadonly } from '../reactivity/reactive';
import { initProps } from './componentProps';
import { PublicInstanceProxyHandlers } from './componentPublicInstance';
export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
  };
  return component;
}

export function setupComponent(instance) {
  // TODO
  initProps(instance, instance.vnode.props);
  // initSlots

  const setupResult = setupStatefulComponent(instance);
}
function setupStatefulComponent(instance: any) {
  const {
    type: { setup },
  } = instance;

  // 创建组件实例代理对象，之后在调用this.xxx时返回需要的数据
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props));
    handleSetupResult(instance, setupResult);
  } else {
    finishComponentSetup(instance);
  }
}
function handleSetupResult(instance, setupResult: any) {
  // TODO 如果setup返回function

  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
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
