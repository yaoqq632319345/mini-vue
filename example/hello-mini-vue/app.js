import { h } from '../../lib/guide-mini-vue.esm.js';
window.root = null;
export const App = {
  render() {
    root = this;
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'h100'],
      },
      // [h('p', {}, 'hello'), h('p', {}, 'mini-vue')]
      'hi, ' + this.msg
    );
  },
};
