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
});
