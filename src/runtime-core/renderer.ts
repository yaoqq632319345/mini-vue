import { Fragment, Text } from './vnode';
import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode: any, rootContainer) {
  patch(vnode, rootContainer);
}
function patch(vnode: any, rootContainer: any) {
  const { shapeFlag, type } = vnode;
  switch (type) {
    case Fragment:
      processFragment(vnode, rootContainer);
      break;
    case Text:
      processTextVNode(vnode, rootContainer);
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        // 处理真实element
        processElement(vnode, rootContainer);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, rootContainer);
      }
  }
}
function processTextVNode(vnode, container) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}
// 只渲染子元素
function processFragment(vnode, container) {
  mountChildren(vnode.children, container);
}

// 元素处理逻辑
function processElement(vnode, container) {
  mountElement(vnode, container); // 初始化逻辑
}
function mountElement(vnode, container) {
  const { type, props, children, shapeFlag } = vnode;
  const el: HTMLElement = (vnode.el = document.createElement(type));
  for (let k in props) {
    const val = props[k];
    const isOn = (k: string) => /^on[A-Z]/.test(k);
    if (isOn(k)) {
      // 代表事件
      const event = k.slice(2).toLowerCase();
      el.addEventListener(event, val);
    } else {
      el.setAttribute(k, val);
    }
  }
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(children, el);
  }

  container.append(el);
}
function mountChildren(children, container) {
  children.forEach((v) => {
    patch(v, container);
  });
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
