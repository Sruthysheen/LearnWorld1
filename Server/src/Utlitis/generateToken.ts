import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateAccessToken = (student_id: string) => {
  const token = jwt.sign({ student_id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
  console.log("token", token);
  
  return token;
};


export const generateRefreshToken = (student_id: string) => {
  const token = jwt.sign({ student_id }, process.env.JWT_REFRESHSECRET as string, {
    expiresIn: "20s",
  });
  console.log("token", token);
  
  return token;
};

