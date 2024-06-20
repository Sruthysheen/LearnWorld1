import { date, z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type NewPasswordType = {
    newPassword: string;
    confirmPassword: string;
  };

  export const NewpasswordSchema: ZodType<NewPasswordType> = z
  .object({
    newPassword: z.string().refine((value) => value.trim() !== "", {
      message: "Name cannot be empty",
    }),
    confirmPassword: z.string().refine((value) => value.trim() !== "", {
      message: "Name cannot be empty",
    }),
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: "Wrong confirm password",
    path: ["confirmPassword"],
  });

export const newPasswordSetting = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordType>({
    resolver: zodResolver(NewpasswordSchema),
  });
  return {
    register,
    handleSubmit,
    errors,
  };
};