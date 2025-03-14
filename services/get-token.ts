"use server";
import { cookies } from "next/headers";

export async function getAuth() {
  const cookieStore = await cookies();

  const authToken = cookieStore.get("authToken")?.value;
  const isSub = cookieStore.get("sub")?.value;
  const user: {
    ID: number;
    username: string;
    role: "Parent" | "Tutor" | "Children";
  } = JSON.parse(cookieStore.get("user")?.value?.toString() || "{}");
  const isLogged = !!user;

  return { authToken, user, isLogged, isSub };
}
