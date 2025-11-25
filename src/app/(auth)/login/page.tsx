"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "@/lib/utils/toast";
import { login } from "@/lib/api/auth";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { Button, Input, Card } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Welcome back!");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed. Please try again.");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    // Debounce: Prevent submission if already pending
    if (loginMutation.isPending) return;
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex bg-bg-light">
      {/* Left side - Image (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/assassins-creed-7680x4320-21654.jpg"
          alt="Archer App"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-transparent to-bg-light/20" />
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Archer</h1>
            <p className="text-text-secondary">
              Align your tasks with your goals
            </p>
          </div>

          <Card>
            <h2 className="text-center font-semibold mb-6">Welcome back</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password")}
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-border-medium text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-text-secondary">
                    Remember me
                  </span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary-hover"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loginMutation.isPending}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-text-secondary">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary hover:text-primary-hover font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
