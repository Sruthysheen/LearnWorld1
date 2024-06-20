import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminCategoryData } from "../api/types";

export type CategoryInfo = AdminCategoryData;
  

export const categoryAuthSchema: ZodType<CategoryInfo> = z.object({
    categoryname: z.string()
        .trim() // Trim whitespace
        .min(1, { message: "Category name cannot be empty" }) // Ensure it's not empty after trimming
        .regex(/^[a-zA-Z ]+$/, {
            message: "Category name must contain only alphabetic characters and spaces",
        }),
    description: z.string()
        .trim() // Trim whitespace
        .min(1, { message: "Category description cannot be empty" }) // Ensure it's not empty after trimming
});

export const CategoryValidation = () => {
    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CategoryInfo>({ resolver: zodResolver(categoryAuthSchema) });

    console.log("I am validation");

    return {
        register,
        handleSubmit,
        errors,
        reset
    };
};

