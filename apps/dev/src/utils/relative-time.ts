export function relativeTime(time: number) {
  const delta = Math.round((+new Date() - time) / 1000);

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;

  let ret: string;

  if (delta < 30) {
    ret = 'just now';
  } else if (delta < minute) {
    ret = `${delta} seconds ago`;
  } else if (delta < 2 * minute) {
    ret = 'a minute ago';
  } else if (delta < hour) {
    ret = `${Math.floor(delta / minute)} minutes ago`;
  } else if (Math.floor(delta / hour) === 1) {
    ret = '1 hour ago';
  } else if (delta < day) {
    ret = `${Math.floor(delta / hour)} hours ago`;
  } else if (delta < day * 2) {
    ret = 'yesterday';
  } else if (delta < week) {
    ret = `${Math.floor(delta / day)} days ago`;
  } else if (Math.floor(delta / week) === 1) {
    ret = '1 week ago';
  } else {
    ret = `${Math.floor(delta / week)} weeks ago`;
  }

  return ret;
}
