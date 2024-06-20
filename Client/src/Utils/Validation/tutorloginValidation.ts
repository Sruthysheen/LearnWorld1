import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type LoginInfo = {
  tutoremail: string;
  password: string;
};

export const tutorschema: ZodType<LoginInfo> = z.object({
  tutoremail: z
    .string()
    .email({ message: "Please provide a valid email address" }),
  password: z.string().min(5, { message: "Please enter password" }),
});

export const useTutorValidate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInfo>({ resolver: zodResolver(tutorschema) });
  return {
    register,
    handleSubmit,
    errors,
  };
};