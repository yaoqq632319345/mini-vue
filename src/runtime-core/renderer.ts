import { createComponentInstance, setupComponent } from './component';

export function render(vnode: any, rootContainer) {
  patch(vnode, rootContainer);
}
function patch(vnode: any, rootContainer: any) {
  processComponent(vnode, rootContainer);
}
function processComponent(vnode, container) {
  mountComponent(vnode, container);
}
function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance); // 组件初始化完毕

  // 处理子节点
  setupRenderEffect(instance, container);
}
function setupRenderEffect(instance: any, container) {
  const subTree = instance.render();

  // 也是调用patch

  patch(subTree, container);
}
