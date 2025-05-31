/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import { usersSchema, UsersSchema } from "../schema/users-schema";
import { login } from "@/apis/auth";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { setToken, setRole } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsersSchema>({
    resolver: zodResolver(usersSchema),
  });

  const onSubmit = async (data: UsersSchema) => {
    console.log("Submitted data:", data);
    setEmailError("");
    setPasswordError("");
    setSubmitting(true);
    try {
      const result = await login(data.email, data.password);
      if (result && result.data) {
        setToken(result.data.access_token);
        setRole(result.data.role);
        if (result.data.role == "Administrator") {
          router.push("/admin");
        } else if (result.data.role == "Teacher") {
          router.push("/teacher");
        } else if (result.data.role == "Student") {
          router.push("/student");
        }
      }
    } catch (err: any) {
      console.log(err);
      if (err.status == 400) {
        if (err.title == "Email") {
          setEmailError(err.detail);
        } else if (err.title == "Password") {
          console.log("Password error:", err.detail);
          setPasswordError(err.detail);
        }
      }
      // console.error("Login error:", err);
    }
    setSubmitting(false);
    // Call API login tại đây
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-32 h-32 relative mb-2">
          <Image
            src="/logo-ptit.png"
            alt="University Logo"
            width={128}
            height={128}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-900">
          University E-Learning System
        </h1>
        <p className="text-sm text-center text-gray-600">
          Please sign in to access application
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className="w-full"
          />
          {errors.email && !emailError && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              className="w-full pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4 text-gray-400" />
              ) : (
                <EyeIcon className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && !passwordError && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-sm font-normal">
            Remember me
          </Label>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-700 hover:bg-blue-800"
        >
          Sign In
          {submitting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-r-transparent border-b-transparent border-l-blue-500" />
            </div>
          )}
        </Button>
      </form>

      <div className="pt-4 text-center text-xs text-gray-500 border-t">
        <p>
          © {new Date().getFullYear()} University E-Learning System. All rights
          reserved.
        </p>
        <p className="mt-1">Contact IT support for login assistance</p>
      </div>
    </div>
  );
}
