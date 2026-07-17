"use server";

import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function updateUserRole(formData: FormData) {
  await requireOwner();
  
  const id = formData.get("id") as string;
  const role = formData.get("role") as Role;
  const isActive = formData.get("isActive") === "true";
  
  await prisma.user.update({
    where: { id },
    data: { role, isActive },
  });
  
  revalidatePath("/owner/users");
}

export async function createUser(formData: FormData) {
  await requireOwner();
  
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as Role;

  if (!name || !phone || !password || !role) {
    throw new Error("All fields are required");
  }

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    throw new Error("Phone number already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      phone,
      email: email || null,
      passwordHash,
      role,
      isActive: true,
    },
  });

  revalidatePath("/owner/users");
}

export async function deleteUser(formData: FormData) {
  await requireOwner();
  
  const id = formData.get("id") as string;
  
  await prisma.user.delete({ where: { id } });
  
  revalidatePath("/owner/users");
}
