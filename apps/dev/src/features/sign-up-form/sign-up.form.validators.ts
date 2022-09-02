import type { ValidationResult } from "@crux/utils";

export const emailValidators = [
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

export const passwordValidators = [
  (str: string) => {
    /**
     * at least one lowercase letter (?=.*[a-z]), one uppercase letter (?=.*[A-Z]), one digit (?=.*[0-9]), one special character (?=.*[^A-Za-z0-9]), and is at least eight characters long(?=.{8,}).
     */
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(str)) {
      return {
        message: 'strong',
        success: true,
      };
    /** 
     * at least six characters long and meets all the other requirements, or has no digit but meets the rest of the requirements.
    */
    } else if (/((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))/.test(str)) {
      return {
        message: 'medium',
        success: true,
      };
    } else {
      return {
        message: 'weak',
        success: true,
      };
    }
  }
];