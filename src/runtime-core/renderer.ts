import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode: any, rootContainer) {
  patch(vnode, rootContainer);
}
function patch(vnode: any, rootContainer: any) {
  const { shapFlag } = vnode;
  if (shapFlag & ShapeFlags.ELEMENT) {
    // 处理真实element
    processElement(vnode, rootContainer);
  } else if (shapFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, rootContainer);
  }
}

// 元素处理逻辑
function processElement(vnode, container) {
  mountElement(vnode, container); // 初始化逻辑
}
function mountElement(vnode, container) {
  const { type, props, children, shapFlag } = vnode;
  const el: HTMLElement = (vnode.el = document.createElement(type));
  for (let k in props) {
    el.setAttribute(k, props[k]);
  }
  if (shapFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapFlag & ShapeFlags.ARRAY_CHILDREN) {
    children.forEach((v) => {
      patch(v, el);
    });
  }

  container.append(el);
}

// 组件处理逻辑
function processComponent(vnode, container) {
  mountComponent(vnode, container); // 初始化逻辑
}
function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance); // 组件初始化完毕

  // 处理子节点
  setupRenderEffect(instance, container);
}
function setupRenderEffect(instance: any, container) {
  const subTree = instance.render.call(instance.proxy);

  // 也是调用patch
  patch(subTree, container);

  // 处理完毕子树之后，subtree.el 就会有值了
  instance.vnode.el = subTree.el;
}
