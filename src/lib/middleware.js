
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const middleware = async (req) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production" ? true : false,
  });

  if (token) {
    // User logged in, allow access
    return NextResponse.next();
  } else {
    // Not logged in, redirect to login page
    return NextResponse.redirect(new URL('log', req.url));
  }
};

export const config = {
  matcher: [
    '/', // homepage guarded
  ],
};
