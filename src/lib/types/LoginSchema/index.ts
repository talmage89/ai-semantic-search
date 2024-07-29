import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z.string().trim().min(1, { message: 'Email required' }).email({ message: 'Invalid email' }),
    password: z
      .string()
      .trim()
      .min(1, { message: 'Password required' })
      .min(8, { message: 'Password must have at least 8 characters' }),
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containesNumber = (ch: string) => /[0-9]/.test(ch);
    const containsSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~]/.test(ch);
    if (
      !containsUppercase(password) ||
      !containsLowercase(password) ||
      !containesNumber(password) ||
      !containsSpecialChar(password)
    ) {
      checkPassComplexity.addIssue({
        code: 'custom',
        message: 'Password does not meet complexity requirements',
      });
    }
  });
