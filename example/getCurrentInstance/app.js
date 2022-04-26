import { h, getCurrentInstance } from '../../lib/guide-mini-vue.esm.js';
const Foo = {
  setup(props) {
    const _this = getCurrentInstance();
    console.log('Foo', _this);
  },
  render() {
    return h('div', {}, 'foo:' + this.count);
  },
};
export const App = {
  render() {
    return h(
      'div',
      {},
      // [h('p', {}, 'hello'), h('p', {}, 'mini-vue')]
      [h('p', {}, `hi,${this.msg}`), h(Foo, { count: 1 })]
    );
  },
  setup() {
    const _this = getCurrentInstance();
    console.log('App', _this);
    return { msg: 'mini-vue' };
  },
};
