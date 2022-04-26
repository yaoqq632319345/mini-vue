import { shallowReadonly } from '../reactivity/reactive';
import { emit } from './componentEmits';
import { initProps } from './componentProps';
import { PublicInstanceProxyHandlers } from './componentPublicInstance';
import { initSlots } from './componentSlots';
export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {},
    slots: {},
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
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
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
