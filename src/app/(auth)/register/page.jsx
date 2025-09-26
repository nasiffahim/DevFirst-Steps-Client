import { Suspense } from "react";
import RegisterPageClient from "./RegisterPageClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading login page...</div>}>
      <RegisterPageClient />
    </Suspense>
  );
}
