import {z, ZodType} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";



export type LoginInfo = {
    studentemail: string;
    password: string;
};

export const AuthSchema: ZodType<LoginInfo> = z.object({
    studentemail: z.string()
                   .email({message: "Please provide a valid email address"}),
    password: z.string().min(6, {message: "Please enter password"}),
});

export const useLoginValidate = () =>{
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginInfo>({ resolver: zodResolver(AuthSchema)});
    return {
        register,
        handleSubmit,
        errors
    };
};