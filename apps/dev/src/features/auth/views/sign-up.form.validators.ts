import type { ValidationResult } from "@crux/utils";

export const validators = [
  /**
   * Email regex
   */
  (str: string) => /^\S+@\S+\.\S+$/.test(str)
    ? ({
      message: 'Passes regex',
      success: true
    })
    : ({
      message: 'Not a valid email address',
      success: false
    }),
    
  /**
   * Email address is not taken
  */
  (str: string) => new Promise(resolve => {
    setTimeout(() => {
      resolve({
        message: 'Email address not taken',
        success: true
      })
    })
  }) as Promise<ValidationResult>,
];