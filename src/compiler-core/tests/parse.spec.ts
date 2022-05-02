import { NodeTypes } from '../src/ast';
import { baseParse } from '../src/parse';

describe('Parse', () => {
  describe('解析插值', () => {
    test('插值', () => {
      const ast = baseParse('{{ message }}');
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: 'message',
        },
      });
    });
  });
});
