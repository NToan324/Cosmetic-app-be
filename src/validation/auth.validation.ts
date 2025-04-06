import z from 'zod'

export class AuthValidation {
  static signupSchema() {
    return {
      body: z.object({
        phone: z
          .string()
          .min(10, 'Phone number must be at least 10 characters long')
          .nonempty('Phone number is required'),
        name: z.string().nonempty('User name is required')
      })
    }
  }

  static loginSchema() {
    return {
      body: z
        .object({
          phone: z.string().min(10, 'Phone number must be at least 10 characters long').optional(),
          email: z.string().email('Email is not valid').optional(),
          password: z.string().nonempty('Password is required')
        })
        .refine((data) => data.phone || data.email, {
          message: 'Either phone or email is required',
          path: ['phone', 'email']
        })
    }
  }
}
