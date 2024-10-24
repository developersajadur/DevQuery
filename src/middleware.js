import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const middleware = async (request) => {
  const token =
    cookies().get("next-auth.session-token") ||
    cookies().get("__Secure-next-auth.session-token");
  const pathname = request.nextUrl.pathname;

  if (pathname.includes("api")) {
    return NextResponse.next();
  }

  if (!token) {
    const redirectUrl = new URL(
      `/login?redirect=${encodeURIComponent(pathname)}`,
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  // If token is present, proceed
  return NextResponse.next();
};

export const config = {
  matcher: [
    "/ask-question/:path*",
    "/edit/:path*",
    "/dashboard/:path*",
    "/manage-questions/:path*",
    "/manage-users/:path*",
    "/manage-jobs/:path*",
    "/manage-blogs/:path*",
    "/payments/:path*",
    "/chat/:path*",
    "/invite-meeting/:path*",
    "/questions/invite-meeting/:path*",
    "/jobs/post-job/:path*",
    "/users/edit/:path*",
  ],
};
