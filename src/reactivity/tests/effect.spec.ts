import { effect } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  it("核心模块", () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);

    user.age++;

    expect(nextAge).toBe(12);
  });
});

