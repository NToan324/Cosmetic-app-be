import z from 'zod'

class UserValidation {
  signupSchema() {
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
}
const userValidation = new UserValidation()
export default userValidation
