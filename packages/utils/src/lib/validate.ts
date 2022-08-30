export async function validate<T>(value: T, validators: ((val: T) => Promise<ValidationResult> | ValidationResult)[]) {
  const results = [] as Promise<ValidationResult>[];

  for (const validator of validators) {
    const res = validator(value);

    if ((res as Promise<ValidationResult>).then) {
      results.push(res as Promise<ValidationResult>);
    } else {
      results.push(Promise.resolve(res));
    }
  }

  const res = await Promise.all(results);

  return {
    errors: res.filter(r => !r.success).map(validation => validation.message),
    messages: res.filter(r => r.success).map(validation => validation.message),
  }
}

export type ValidationResult = {
  message: string;
  success: boolean,
}