import { EMPTY_OBJ } from './../shared/index';
import { Fragment, Text } from './vnode';
import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from './component';
import { createAppAPI } from './createApp';
import { effect } from '../reactivity';

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    createTextNode: hostCreateTextNode,
    setElementText: hostSetElementText,
    remove: hostRemove,
  } = options;
  function render(vnode: any, rootContainer) {
    patch(null, vnode, rootContainer, null);
  }
  function patch(n1, n2: any, rootContainer: any, parentComponent) {
    const { shapeFlag, type } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, rootContainer, parentComponent);
        break;
      case Text:
        processTextVNode(n1, n2, rootContainer);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 处理真实element
          processElement(n1, n2, rootContainer, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, rootContainer, parentComponent);
        }
    }
  }
  function processTextVNode(n1, n2, container) {
    const { children } = n2;
    const textNode = (n2.el = hostCreateTextNode(children));
    hostInsert(textNode, container);
  }
  // 只渲染子元素
  function processFragment(n1, n2, container, parentComponent) {
    mountChildren(n2.children, container, parentComponent);
  }

  // 元素处理逻辑
  function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent); // 初始化逻辑
    } else {
      patchElement(n1, n2, container, parentComponent); // 更新逻辑
    }
  }
  function patchElement(n1, n2, container, parentComponent) {
    console.log('element更新流程');
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    const el = (n2.el = n1.el);
    patchChildren(n1, n2, el, parentComponent);
    patchProps(el, oldProps, newProps);
  }
  function patchChildren(n1, n2, container, parentComponent) {
    const { shapeFlag, children: c2 } = n2;
    const { shapeFlag: prevShapeFlag, children: c1 } = n1;
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 新节点是文本
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 如果之前的节点是数组，先移除
        unMountedChildren(c1);
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2);
      }
    } else {
      // 新节点是数组
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 如果之前的节点是文本，先清除
        hostSetElementText(container, '');
        mountChildren(c2, container, parentComponent);
      }
    }
  }
  function unMountedChildren(children) {
    for (let i = 0; i < children.length; i++) {
      hostRemove(children[i].el);
    }
  }
  function patchProps(el, oldProps, newProps) {
    if (oldProps === newProps) return;
    for (let k in newProps) {
      const nextVal = newProps[k];
      const prevVal = oldProps[k];
      if (nextVal !== prevVal) {
        hostPatchProp(el, k, prevVal, nextVal);
      }
    }
    for (let k in oldProps) {
      if (!(k in newProps)) {
        hostPatchProp(el, k, oldProps[k], null);
      }
    }
  }
  function mountElement(vnode, container, parentComponent) {
    const { type, props, children, shapeFlag } = vnode;
    const el: HTMLElement = (vnode.el = hostCreateElement(type));
    for (let k in props) {
      const val = props[k];
      hostPatchProp(el, k, null, val);
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el, parentComponent);
    }

    hostInsert(el, container);
  }
  function mountChildren(children, container, parentComponent) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent);
    });
  }

  // 组件处理逻辑
  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent); // 初始化逻辑
  }
  function mountComponent(initialVNode: any, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent);
    setupComponent(instance); // 组件初始化完毕

    // 处理子节点
    setupRenderEffect(instance, initialVNode, container);
  }
  function setupRenderEffect(instance: any, initialVNode, container) {
    effect(() => {
      if (!instance.isMounted) {
        const subTree = (instance.subTree = instance.render.call(
          instance.proxy
        ));
        // 也是调用patch
        patch(null, subTree, container, instance);
        // 处理完毕子树之后，subtree.el 就会有值了
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        const preSubTree = instance.subTree;
        const subTree = (instance.subTree = instance.render.call(
          instance.proxy
        ));
        patch(preSubTree, subTree, container, instance);
      }
    });
  }

  return {
    createApp: createAppAPI(render),
  };
}
