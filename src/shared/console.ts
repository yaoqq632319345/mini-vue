export function ___console(text1, text2) {
  var str = `%c ${text1} %c ${text2}`;
  var arg1 = 'color: #fadfa3; background: #030307; padding:5px 0;';
  var arg2 = 'background: pink; padding:5px 0;';
  console.log(str, arg1, arg2);
}
