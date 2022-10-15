export function reporting() {
  return {
    track
  };

  function track(data: unknown) {
    console.group('Reporting Service:');
    console.log(data);
    console.groupEnd();
  }
}