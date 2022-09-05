import { createEventEmitter } from '@crux/event-emitter';
import { debounce, validate } from '@crux/utils';
import type { RecursivePartial } from '@crux/utils'; 
import type { SignupFormState } from './sign-up-form.slice';
import { emailValidators, passwordValidators } from './sign-up.form.validators';

export interface SignupFormActions {
  onCancel(): string;
  onChangePassword(value: string): void;
  onChangeEmail(value: string): void;
  onSubmit(email: string, password: string): void;
}

export type Events = {
  reset: null,
  update: RecursivePartial<SignupFormState>
}

export type SignupFormService = ReturnType<typeof signupForm>;

export function signupForm() {
  const emitter = createEventEmitter<Events>();

  return {
    ...emitter,
    onCancel,
    onChangePassword,
    onChangeEmail
  }

  async function onCancel() {
    emitter.emit('reset', null);
  }
  
  async function onChangePassword(value: string) {
    emitter.emit('update', {
      password: {
        isPristine: false,
        value,
      },
    });

    debounce(async () => {
      const { messages } = await validate(value, passwordValidators);

      emitter.emit('update', {
        password: {
          successMessage: messages[0]
        },
      });
    }, 250)();
  }
  async function onChangeEmail(value: string) {
    emitter.emit('update', {
      email: {
        isPristine: false,
        value,
      },
    });

    debounce(async () => {
      const { errors, messages } = await validate(value, emailValidators);

      emitter.emit('update', {
        email: {
          errorMessages: errors,
          successMessage: messages[0]
        },
      });
    }, 250)();
  }
}

