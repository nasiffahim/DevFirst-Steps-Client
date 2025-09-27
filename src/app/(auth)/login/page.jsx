import { Suspense } from "react";
import LoginPageClient from "../login/LoginPageClient"

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading login page...</div>}>
      <LoginPageClient />
    </Suspense>
  );
}
