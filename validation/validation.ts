import { z } from "zod";

export const createSchema = (fields: string[]) => {
  return z.object(
    fields.reduce(
      (acc, field) => {
        switch (field.toLowerCase()) {
          case "user name":
            acc[field] = z
              .string()
              .min(3, "User Name must be at least 3 characters");
            break;
          case "email":
            acc[field] = z.string().email("Invalid email format");
            break;
          case "password":
            acc[field] = z
              .string()
              .min(6, "Password must be at least 6 characters");
            break;
          case "confirm password":
            acc[field] = z
              .string()
              .min(6, "Confirm Password must be at least 6 characters");
            break;
          default:
            acc[field] = z.string().min(1, `${field} is required`);
        }
        return acc;
      },
      {} as Record<string, z.ZodString>,
    ),
  );
};
