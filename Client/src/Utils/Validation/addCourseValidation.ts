import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type coursesInfo = {
  courseName: string;
  courseDescription: string;
  shortDescription: string;
  category: string;
  coursefee: string;
  courseDuration: string;
  
};


const schema: ZodType<coursesInfo> = z.object({

  courseName: z.string().min(4, {
    message: "course name must contain at least 4 characters",
  }).max(35, {
    message: "course name cannot exceed 35 characters",
  }).refine((value) => value.trim() !== "", {
    message: "course name cannot be empty",
  }).refine((value) => /^[a-zA-Z\s\S]+$/.test(value), {
    message: "course name must contain only letters, spaces, and special characters",
  }),

  courseDescription:z.string().min(10, {
    message: "Description must contain at least 10 characters",
  }).max(100, {
    message: "Cannot exceed 100 characters",
  }).refine((value) => value.trim() !== "", {
    message: "Description cannot be empty",
  }).refine((value) => /^[a-zA-Z\s\S]+$/.test(value), {
    message: "Description must contain only letters, spaces, and special characters",
  }),

  shortDescription: z.string().min(20, {
    message: "Short description must contain at least 20 characters",
  }).max(300, {
    message: "Cannot exceed 300 characters",
  }).refine((value) => value.trim() !== "", {
    message: "Short description cannot be empty",
  }).refine((value) => /^[a-zA-Z\s\S]+$/.test(value), {
    message: "Short description must contain only letters, spaces, and special characters",
  }),

  category: z.string().min(1, {
    message: "Category is required",
  }).refine((value) => value.trim() !== "", {
    message: "Category cannot be empty",
  }),

  coursefee: z.string().refine((value) => /^\d{1,3}$/.test(value), {
    message: "Course fee must be a number with at most 3 digits",
  }).refine((value) => value.trim() !== "", {
    message: "Course fee cannot be empty",
  }), 
  courseDuration: z.string().refine((value) => /^\d{1,3}$/.test(value), {
    message: "Course fee must be a number",
  }).refine((value) => value.trim() !== "", {
    message: "Course duration cannot be empty",
  }), 
});




export const useCourseValidation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<coursesInfo>({ resolver: zodResolver(schema) });
console.log("useCourseBasicValidate");

  return {
    register,
    handleSubmit,
    errors,
  };
};