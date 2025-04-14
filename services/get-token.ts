"use server";
import { cookies } from "next/headers";

export async function getAuth() {
  const cookieStore = await cookies();

  const authToken = cookieStore.get("authToken")?.value;
  const user: {
    ID: number;
    username: string;
    Finduser: { role: "user" | "admin" };
  } = JSON.parse(cookieStore.get("user")?.value?.toString() || "{}");
  const isLogged = !!user;

  return { authToken, user, isLogged };
}
