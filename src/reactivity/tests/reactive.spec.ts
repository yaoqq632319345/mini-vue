import { isReactive, isReadonly, reactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const ori = { foo: 1 };
    const observed = reactive(ori);

    expect(observed).not.toBe(ori);

    expect(observed.foo).toBe(1);

    expect(isReactive(observed)).toBe(true);
    expect(isReactive(ori)).toBe(false);

    expect(isReadonly(observed)).toBe(false);
    expect(isReadonly(ori)).toBe(false);
  });

  test('多级reactive', () => {
    const origin = {
      foo: {
        bar: 1,
      },
      array: [{ baz: 2 }],
    };

    const observed = reactive(origin);
    expect(isReactive(observed.foo)).toBe(true);
    expect(observed.foo.bar).toBe(1);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
    expect(observed.array[0].baz).toBe(2);
  });

  it('包装单值', () => {
    console.warn = jest.fn();
    const count = reactive(100);
    expect(count).toBe(100);
    expect(console.warn).toBeCalled();
  });
});
