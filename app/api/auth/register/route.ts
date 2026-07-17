import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Phone number is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error.issues[0].message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { name, phone, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Phone number already registered" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        passwordHash,
        wallet: {
          create: {
            balance: 0,
          },
        },
      },
    });

    return new Response(JSON.stringify({ message: "Registration successful", userId: user.id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
