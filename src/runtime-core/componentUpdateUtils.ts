export const shouldUpdateComponet = (n1, n2) => {
  const { props: prevProps } = n1;
  const { props: nextProps } = n2;
  for (let k in nextProps) {
    if (nextProps[k] !== prevProps) return true;
  }
  return false;
};
