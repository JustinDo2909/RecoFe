"use server";
import { cookies } from "next/headers";

export async function getAuth() {
  const cookieStore = await cookies();

  const authToken = cookieStore.get("authToken")?.value;

  // Giải mã cookie user từ dạng URL encoded → JSON object
  const rawUserCookie = cookieStore.get("user")?.value || "";

  const decodedUser = decodeURIComponent(rawUserCookie);
  const user = decodedUser ? JSON.parse(decodedUser) : null;

  const isLogged = !!user;

  return { authToken, user, isLogged };
}
