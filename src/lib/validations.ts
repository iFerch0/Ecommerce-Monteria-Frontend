import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
    firstName: z.string().min(2, 'Mínimo 2 caracteres'),
    lastName: z.string().min(2, 'Mínimo 2 caracteres'),
    phone: z
      .string()
      .min(7, 'Teléfono inválido')
      .regex(/^[0-9+\-\s()]+$/, 'Solo números, +, -, espacios'),
    city: z.string().min(2, 'Ciudad requerida'),
    department: z.string().min(2, 'Departamento requerido'),
    address: z.string().min(5, 'Dirección muy corta'),
    customerType: z.enum(['wholesale', 'retail']),
    businessName: z.string().optional(),
    nit: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.customerType === 'wholesale') {
        return !!data.businessName && data.businessName.length >= 2;
      }
      return true;
    },
    {
      message: 'Razón social requerida para mayoristas',
      path: ['businessName'],
    }
  );

export type RegisterFormData = z.infer<typeof registerSchema>;
