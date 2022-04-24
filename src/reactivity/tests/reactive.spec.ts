import { reactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const ori = { foo: 1 };
    const observed = reactive(ori);

    expect(observed).not.toBe(ori);

    expect(observed.foo).toBe(1);
  });
});
