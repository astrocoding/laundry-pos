"use server";

import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

export async function updateUserRole(formData: FormData) {
  await requireOwner();
  
  const id = formData.get("id") as string;
  const role = formData.get("role") as Role;
  
  await prisma.user.update({
    where: { id },
    data: { role },
  });
  
  revalidatePath("/owner/users");
}
