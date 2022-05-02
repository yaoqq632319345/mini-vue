import { NodeTypes } from './ast';

export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context));
}
function parseChildren(context) {
  const nodes: any = [];

  if (context.source.startsWith('{{')) {
    let node = parseInterpolation(context);
    nodes.push(node);
  }

  return nodes;
}

function parseInterpolation(context) {
  const openDelimiter = '{{';
  const closeDelimiter = '}}';
  const len = openDelimiter.length;

  const closeIndex = context.source.indexOf(closeDelimiter, len);

  advanceBy(context, len);

  const rawContentLength = closeIndex - len;
  const rawContent = context.source.slice(0, rawContentLength);
  const content = rawContent.trim();

  advanceBy(context, rawContentLength + 2);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
    },
  };
}

function advanceBy(context, length) {
  context.source = context.source.slice(length);
}
function createRoot(children) {
  return {
    children,
  };
}
function createParserContext(content: string): any {
  return {
    source: content,
  };
}
