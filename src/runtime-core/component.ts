export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
  };
  return component;
}

export function setupComponent(instance) {
  // TODO
  // initProps
  // initSlots

  const setupResult = setupStatefulComponent(instance);
}
function setupStatefulComponent(instance: any) {
  const {
    type: { setup },
  } = instance;
  if (setup) {
    const setupResult = setup();
    handleSetupResult(instance, setupResult);
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
