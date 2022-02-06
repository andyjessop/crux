import { createEventEmitter } from "@crux/event-emitter";

export function dev() {
  const emitter = createEventEmitter<{
    'test': { data: true }
    'test2': { data2: true }
  }>();
  
  console.log(emitter);
}
