export function createSidebar() {
  return {
    mount, unmount,
  };

  async function mount(el: Element, state: any) {
    console.log('Mounting sidebar...');

    return new Promise(resolve => {
      setTimeout(() => {
        const span = document.createElement('span');
        span.innerText = 'sidebar';
    
        el.appendChild(span);
  
        console.log('Mounted sidebar');

        resolve();
      }, 1000);
    });
  }

  async function unmount(el: Element, state: string) {
    console.log('Unmounting sidebar...');

    return new Promise(resolve => {
      setTimeout(() => {
        // remove event listeners, etc.

        console.log('Unounted sidebar');
        resolve();
      }, 1000);
    });
  }
}