import { h, provide, inject } from '../../lib/guide-mini-vue.esm.js';
const Foo = {
  name: 'Foo',
  setup(props) {
    const foo = inject('foo');
    const bar = inject('bar');
    return {
      foo,
      bar,
    };
  },
  render() {
    return h('div', {}, [
      h('p', {}, 'child-foo:' + this.foo),
      h('p', {}, 'child-bar:' + this.bar),
    ]);
  },
};
export const App = {
  name: 'App',
  render() {
    return h('div', {}, [h('p', {}, `hi,${this.msg}`), h(Foo)]);
  },
  setup() {
    provide('foo', 'provide-foo');
    provide('bar', 'provide-bar');
    return { msg: 'mini-vue' };
  },
};
