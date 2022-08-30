import { createEventEmitter } from '@crux/event-emitter';
import { debounce, validate } from '@crux/utils';

export interface SignupFormData {
  email: {
    errorMessages: string[];
    isPristine: boolean;
    name: string;
    placeholder: string;
    successMessage: string | null;
    value: string;
  },
  password: {
    errorMessages: string[];
    isPristine: boolean;
    name: string;
    placeholder: string;
    successMessage: string | null;
    value: string;
  }
}

export interface SignupFormActions {
  onChange(name: string, value: string): void;
  onSubmit(): void;
}

export type Events = {
  init: FormData
}

function signUpForm() {
  const emitter = createEventEmitter<Events>();

  return {
    onChange,
  }
  
  async function onChange(name: string, value: string) {
    debounce(async () => {
      // const { errors, messages } = await validate(value, validators);
    }, 250);
  }
}

