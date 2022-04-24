import { readonly } from '../reactive';

describe('readonly', () => {
  it('核心实现', () => {
    const origin = { foo: 1, bar: { baz: 2 } };
    const wrap = readonly(origin);
    expect(wrap).not.toBe(origin);
    expect(wrap.foo).toBe(1);
  });

  it('set 警告', () => {
    console.warn = jest.fn();
    const user = readonly({
      age: 18,
    });
    user.age++;

    expect(console.warn).toBeCalled();
  });
});
