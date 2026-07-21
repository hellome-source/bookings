import { cookies } from "next/headers";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map();

function getClientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(ip) {
  const record = attempts.get(ip);
  if (!record) return false;
  if (Date.now() - record.start > WINDOW_MS) {
    attempts.delete(ip);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordAttempt(ip) {
  const record = attempts.get(ip);
  if (!record || Date.now() - record.start > WINDOW_MS) {
    attempts.set(ip, { count: 1, start: Date.now() });
  } else {
    record.count += 1;
  }
}

function resetAttempts(ip) {
  attempts.delete(ip);
}

export async function POST(request) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return Response.json({ error: "Admin password is not configured." }, { status: 500 });
  }

  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return Response.json({ error: "Too many failed attempts. Try again later." }, { status: 429 });
  }

  const formData = await request.formData();
  const password = formData.get("password");

  if (password !== adminPassword) {
    recordAttempt(ip);
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  resetAttempts(ip);

  const cookieStore = await cookies();
  cookieStore.set("admin_token", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return Response.json({ success: true });
}
