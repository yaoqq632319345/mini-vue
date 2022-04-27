import { createRenderer } from '../runtime-core';

function createElement(type) {
  return document.createElement(type);
}

function patchProp(el, k, prevVal, nextVal) {
  const isOn = (k: string) => /^on[A-Z]/.test(k);
  if (isOn(k)) {
    // 代表事件
    const event = k.slice(2).toLowerCase();
    el.addEventListener(event, nextVal);
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(k);
    } else {
      el.setAttribute(k, nextVal);
    }
  }
}

function insert(el, parent) {
  parent.append(el);
}

function createTextNode(text) {
  return document.createTextNode(text);
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  createTextNode,
});

export * from '../runtime-core';
export function createApp(...arg) {
  return renderer.createApp(...arg);
}