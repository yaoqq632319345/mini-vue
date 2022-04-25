import { h } from '../../lib/guide-mini-vue.esm.js';
const Foo = {
  setup(props) {
    console.log(props);
    // return {};
    props.count++;
    console.log(props);
  },
  render() {
    return h('div', {}, 'foo:' + this.count);
  },
};
window.root = null;
export const App = {
  render() {
    root = this;
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'h100'],
        onClick() {
          console.log('click');
        },
        onMousedown() {
          console.log('mousedown');
        },
      },
      // [h('p', {}, 'hello'), h('p', {}, 'mini-vue')]
      [h('p', {}, `hi,${this.msg}`), h(Foo, { count: 1 })]
    );
  },
  setup() {
    return { msg: 'mini-vue' };
  },
};
