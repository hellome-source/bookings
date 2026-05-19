import { cookies } from "next/headers";

export async function POST(request) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return Response.json({ error: "Admin password is not configured." }, { status: 500 });
  }

  const formData = await request.formData();
  const password = formData.get("password");

  if (password !== adminPassword) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_token", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return Response.json({ success: true });
}
