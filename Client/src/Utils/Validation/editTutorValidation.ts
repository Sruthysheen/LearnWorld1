import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type tutorAuth = {
  tutorname: string;
  tutoremail: string;
  phone: string;
};
export const tutorAuthSchema: ZodType<tutorAuth> = z.object({
    tutorname: z
    .string()
    .refine((value) => value.trim() !== "", {
      message: "Name cannot be empty",
    })
    .refine((value) => /^[a-zA-Z ]+$/.test(value), {
      message: "Name must contain only alphabetic characters",
    }),

    tutoremail: z.string().email({
    message: "Please provide a valid email address",
  }),
  phone: z
    .string()
    .min(10, { message: "Whatsapp number should be atleast 10 digits" })
    .max(10, { message: "Whatsapp number should not exceed 10 digits" })
    .refine((value) => /^\d+$/.test(value), {
      message: "Only numeric characters are allowed",
    }),
  
});
export const useTutorAuth = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<tutorAuth>({ resolver: zodResolver(tutorAuthSchema) });
  return {
    register,
    handleSubmit,
    errors,
    reset,
  };
};