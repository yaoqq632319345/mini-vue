import { isProxy, isReactive, isReadonly, readonly } from '../reactive';

describe('readonly', () => {
  it('核心实现', () => {
    const origin = { foo: 1, bar: { baz: 2 } };
    const wrap = readonly(origin);
    expect(wrap).not.toBe(origin);
    expect(wrap.foo).toBe(1);
    expect(isReadonly(wrap)).toBe(true);
    expect(isReadonly(wrap.bar)).toBe(true);
    expect(isReadonly(origin)).toBe(false);
    expect(isReadonly(origin.bar)).toBe(false);

    expect(isReactive(origin)).toBe(false);
    expect(isReactive(wrap)).toBe(false);

    expect(isProxy(wrap)).toBe(true);
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
