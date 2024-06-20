import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type LoginInfo = {
  adminemail: string;
  password: string;
};

export const adminAuthSchema: ZodType<LoginInfo> = z.object({
  adminemail: z
    .string()
    .email({ message: "Please provide a valid email address" }),
  password: z.string().min(5, { message: "Please enter password" }),
});

export const useAdminValidate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInfo>({ resolver: zodResolver(adminAuthSchema) });
  return {
    register,
    handleSubmit,
    errors,
  };
};