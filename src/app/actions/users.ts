"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createUser(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const email = formData.get("email") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as any;
  const password = formData.get("password") as string;

  if (!email || !fullName || !role || !password) {
    throw new Error("Missing fields");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      fullName,
      role,
      passwordHash,
      isVerified: true
    }
  });

  revalidatePath("/superadmin/users");
  revalidatePath("/[locale]/superadmin/users", "page");
}

export async function deleteUser(userId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Prevent self-deletion
  if (session.user.id === userId) {
    throw new Error("Cannot delete your own account");
  }

  await prisma.user.delete({
    where: { id: userId }
  });

  revalidatePath("/superadmin/users");
  revalidatePath("/[locale]/superadmin/users", "page");
}
