"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { MachineStatus, MachineType } from "@prisma/client";

export async function updateMachineStatus(formData: FormData) {
  await requireAdmin();
  
  const id = formData.get("id") as string;
  const status = formData.get("status") as MachineStatus;
  
  await prisma.machine.update({
    where: { id },
    data: { status },
  });
  
  revalidatePath("/admin/machines");
}

export async function createMachine(formData: FormData) {
  await requireAdmin();

  const code = formData.get("code") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as MachineType;
  const capacityKg = formData.get("capacityKg") ? parseInt(formData.get("capacityKg") as string) : null;
  const locationZone = formData.get("locationZone") as string | null;

  if (!code || !name || !type) {
    throw new Error("Missing required fields");
  }

  const existing = await prisma.machine.findUnique({
    where: { code },
  });

  if (existing) {
    throw new Error("Machine Code already exists");
  }

  await prisma.machine.create({
    data: {
      code,
      name,
      type,
      capacityKg,
      locationZone,
      status: "AVAILABLE",
      isActive: true,
    },
  });

  revalidatePath("/admin/machines");
}

export async function updateMachine(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const code = formData.get("code") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as MachineType;
  const status = formData.get("status") as MachineStatus;
  const capacityKg = formData.get("capacityKg") ? parseInt(formData.get("capacityKg") as string) : null;
  const locationZone = formData.get("locationZone") as string | null;

  if (!id || !code || !name || !type) {
    throw new Error("Missing required fields");
  }

  const existing = await prisma.machine.findUnique({
    where: { code },
  });

  if (existing && existing.id !== id) {
    throw new Error("Machine Code already exists for another machine");
  }

  await prisma.machine.update({
    where: { id },
    data: {
      code,
      name,
      type,
      status,
      capacityKg,
      locationZone,
    },
  });

  revalidatePath("/admin/machines");
}

export async function deleteMachine(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  if (!id) throw new Error("Missing ID");

  // Check if there are associated sessions or orders
  const sessionsCount = await prisma.machineSession.count({
    where: { machineId: id },
  });

  const ordersCount = await prisma.order.count({
    where: { machineId: id },
  });

  if (sessionsCount > 0 || ordersCount > 0) {
    // Safe delete: mark as inactive and offline
    await prisma.machine.update({
      where: { id },
      data: { isActive: false, status: "OFFLINE" },
    });
  } else {
    // Hard delete
    await prisma.machine.delete({
      where: { id },
    });
  }

  revalidatePath("/admin/machines");
}
