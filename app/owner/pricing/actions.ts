"use server";

import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import { ServiceType, MachineType } from "@prisma/client";

export async function createPricingRule(formData: FormData) {
  await requireOwner();

  const name = formData.get("name") as string;
  const serviceType = formData.get("serviceType") as ServiceType;
  const machineType = formData.get("machineType") as MachineType;
  const durationMinutes = parseInt(formData.get("durationMinutes") as string);
  const price = parseFloat(formData.get("price") as string);

  if (!name || !serviceType || !machineType || !durationMinutes || isNaN(price)) {
    throw new Error("Missing or invalid required fields");
  }

  await prisma.pricingRule.create({
    data: {
      name,
      serviceType,
      machineType,
      durationMinutes,
      price,
      isActive: true,
    },
  });

  revalidatePath("/owner/pricing");
}

export async function updatePricingRule(formData: FormData) {
  await requireOwner();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const serviceType = formData.get("serviceType") as ServiceType;
  const machineType = formData.get("machineType") as MachineType;
  const durationMinutes = parseInt(formData.get("durationMinutes") as string);
  const price = parseFloat(formData.get("price") as string);
  const isActive = formData.get("isActive") === "true";

  if (!id || !name || !serviceType || !machineType || !durationMinutes || isNaN(price)) {
    throw new Error("Missing or invalid required fields");
  }

  await prisma.pricingRule.update({
    where: { id },
    data: {
      name,
      serviceType,
      machineType,
      durationMinutes,
      price,
      isActive,
    },
  });

  revalidatePath("/owner/pricing");
}

export async function deletePricingRule(formData: FormData) {
  await requireOwner();

  const id = formData.get("id") as string;
  if (!id) throw new Error("Missing ID");

  // Check if there are associated orders
  const ordersCount = await prisma.order.count({
    where: { pricingRuleId: id },
  });

  if (ordersCount > 0) {
    // Safe delete: mark as inactive
    await prisma.pricingRule.update({
      where: { id },
      data: { isActive: false },
    });
  } else {
    // Hard delete: safe to delete permanently
    await prisma.pricingRule.delete({
      where: { id },
    });
  }

  revalidatePath("/owner/pricing");
}
