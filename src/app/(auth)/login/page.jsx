"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      console.error("Invalid email or password");
      alert("Invalid email or password"); // optional toast
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-4">Please login to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <Mail className="absolute left-3 bottom-0.5 -translate-y-1/2 text-gray-400" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

        <div className="relative">
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        {...register("password", { required: "Password is required" })}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 pr-10"
      />
      {/* Lock icon */}
      <Lock className="absolute left-3 bottom-1 -translate-y-1/2 text-gray-400" />
      {/* Eye toggle icon */}
      <span
        className="absolute right-3 bottom-1 -translate-y-1/2 cursor-pointer text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </span>

      {errors.password && (
        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
      )}
    </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] transition-transform"
            }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-2 flex justify-center">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="flex justify-center">
          <div className="space-y-2">
    
<button

       onClick={() => signIn("google", { callbackUrl: "/" })}
className="flex items-center  rounded-lg shadow-md px-4 py-2 text-sm font-medium hover: focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
  <svg
    className="h-6 w-6 mr-2"
    viewBox="-0.5 0 48 48"
    width="24"
    height="24"
  >
    <g fill="none" fillRule="evenodd">
      <path d="M9.82727273,24 C9.82727273,22.4757 10.0804,21.0144 10.5323,19.6437 L2.62345,13.6043 C1.08207,16.7339 0.213636,20.2603 0.213636,24 C0.213636,27.7365 1.081,31.2608 2.62025,34.3883 L10.5248,28.3371 C10.0772,26.9728 9.82727,25.5168 9.82727,24" fill="#FBBC05"/>
      <path d="M23.7136,10.1333 C27.025,10.1333 30.0159,11.3067 32.3659,13.2267 L39.2023,6.4 C35.0364,2.77333 29.6955,0.533333 23.7136,0.533333 C14.4269,0.533333 6.44541,5.84427 2.62345,13.6043 L10.5323,19.6437 C12.3546,14.112 17.5492,10.1333 23.7136,10.1333" fill="#EB4335"/>
      <path d="M23.7136,37.8667 C17.5492,37.8667 12.3546,33.888 10.5323,28.3563 L2.62345,34.3947 C6.44541,42.1557 14.4269,47.4667 23.7136,47.4667 C29.4455,47.4667 34.9178,45.4315 39.025,41.6181 L31.5178,35.8144 C29.3996,37.1488 26.7323,37.8667 23.7136,37.8667" fill="#34A853"/>
      <path d="M46.1455,24 C46.1455,22.6133 45.9318,21.12 45.6114,19.7333 L23.7136,19.7333 V28.8 H36.3182 C35.688,31.8912 33.9725,34.2677 31.5178,35.8144 L39.025,41.6181 C43.3393,37.6139 46.1455,31.6491 46.1455,24" fill="#4285F4"/>
    </g>
  </svg>
  <span>Continue with Google</span>
</button>
         
       <button
       
         onClick={() => signIn("github", { callbackUrl: "/" })}
    
       className="flex items-center justify-center space-x-2 px-4 py-2 rounded-md bg-gray-800 text-white hover: focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
 <svg
  className="w-5 h-5"
  fill="currentColor"
  viewBox="0 0 24 24"
  aria-hidden="true"
>
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.007-.866-.012-1.716-2.782.603-3.37-1.344-3.37-1.344-.454-1.158-1.11-1.464-1.11-1.464-.908-.618.069-.606.069-.606 1.003.07 1.531 1.032 1.531 1.032.892 1.529 2.341 1.089 2.91.832.092-.644.35-1.089.636-1.338-2.22-.253-4.555-1.113-4.555-4.949 0-1.092.39-1.983 1.029-2.684-.103-.253-.446-1.272.098-2.646 0 0 .84-.268 2.75 1.025A9.643 9.643 0 0 1 12 6.844c.85.004 1.701.112 2.502.324 1.909-1.293 2.747-1.025 2.747-1.025.546 1.373.202 2.392.099 2.646.64.701 1.028 1.592 1.028 2.684 0 3.844-2.339 4.69-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.482A10.05 10.05 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z"
  />
</svg>

  <span>Sign in with GitHub</span>
</button>

           <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 font-medium hover:underline">Register here</Link>
        </p> 
        </div>
</div>
     
      </div>
    </div>
  );
};

export default LoginPage;
