export { cx };

/**
 * Conditionally join classNames into a single string
 */
function cx(...args: Argument[]): string {
  let str = '';
  let i = 0;
  let arg: unknown;

  while (i < args.length) {
    if ((arg = args[i++]) && typeof arg === 'string') {
      str && (str += ' ');
      str += arg;
    }
  }
  return str;
}

type Argument = string | boolean | null | undefined;