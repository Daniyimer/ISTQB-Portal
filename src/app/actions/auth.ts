"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const signUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  locale: z.string().default("en"),
});

export async function signUpUser(prevState: any, formData: FormData) {
  try {
    const validatedFields = signUpSchema.safeParse({
      fullName: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      locale: formData.get("locale"),
    });

    if (!validatedFields.success) {
      return {
        error: "Invalid fields",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { fullName, email, password, locale } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        error: "Email already in use",
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: "CANDIDATE", // default role
      },
    });

  } catch (error) {
    return { error: "Failed to create account" };
  }
  
  // We cannot redirect inside try/catch due to Next.js redirect throwing an error
  redirect(`/${formData.get("locale") || "en"}/auth/signin?success=registered`);
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
