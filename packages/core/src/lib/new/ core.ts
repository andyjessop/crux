import { di } from "@crux/di";

function serviceA() {
  return Promise.resolve(function () {
    return {
      methodA: () => { /** */}
    }
  })
}

const container = di({
  a: { factory: serviceA }
});

async function run() {
  const a = await container.get('a');
}
