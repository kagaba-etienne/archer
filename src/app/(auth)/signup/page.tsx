"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { signup } from "@/lib/api/auth";
import {
  signupSchema,
  type SignupFormData,
  getUserTimezone,
} from "@/lib/validations/auth";
import { Button, Input, Card } from "@/components/ui";
import { CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      timezone: getUserTimezone(),
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch("password");

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast.success("Account created successfully! Welcome to Archer.");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Signup failed. Please try again.");
    },
  });

  const onSubmit = (data: SignupFormData) => {
    // Debounce: Prevent submission if already pending
    if (signupMutation.isPending) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...signupData } = data;
    signupMutation.mutate(signupData);
  };

  // Password strength indicators
  const hasUpperCase = /[A-Z]/.test(password || "");
  const hasLowerCase = /[a-z]/.test(password || "");
  const hasNumber = /[0-9]/.test(password || "");
  const hasMinLength = (password || "").length >= 8;

  return (
    <div className="flex bg-bg-light min-h-screen">
      {/* Left side - Image (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative lg:fixed lg:inset-y-0 lg:left-0">
        <Image
          src="/assassins-creed-7680x4320-21654.jpg"
          alt="Archer App"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-transparent to-bg-light/20" />
      </div>

      {/* Right side - Signup Form */}
      <div className="flex-1 lg:ml-[50%] w-full">
        <div className="flex items-center justify-center min-h-screen p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md my-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Archer</h1>
              <p className="text-text-secondary">
                Start aligning your tasks with your goals
              </p>
            </div>

            <Card>
              <h2 className="font-semibold mb-6 text-center">
                Create your account
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  error={errors.name?.message}
                  {...register("name")}
                  autoComplete="name"
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                  autoComplete="email"
                />

                <div className="space-y-2">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                    error={errors.password?.message}
                    {...register("password")}
                    autoComplete="new-password"
                  />

                  {/* Password strength indicators */}
                  {password && (
                    <div className="space-y-1 text-xs">
                      <PasswordRequirement met={hasMinLength}>
                        At least 8 characters
                      </PasswordRequirement>
                      <PasswordRequirement met={hasUpperCase}>
                        One uppercase letter
                      </PasswordRequirement>
                      <PasswordRequirement met={hasLowerCase}>
                        One lowercase letter
                      </PasswordRequirement>
                      <PasswordRequirement met={hasNumber}>
                        One number
                      </PasswordRequirement>
                    </div>
                  )}
                </div>

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                  autoComplete="new-password"
                />

                <input type="hidden" {...register("timezone")} />

                <div className="text-xs text-text-secondary">
                  By signing up, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={signupMutation.isPending}
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPending
                    ? "Creating account..."
                    : "Create account"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-text-secondary">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary-hover font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Password requirement indicator component
function PasswordRequirement({
  met,
  children,
}: {
  met: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2
        className={`h-3.5 w-3.5 ${
          met ? "text-accent-success" : "text-text-muted"
        }`}
      />
      <span className={met ? "text-accent-success" : "text-text-secondary"}>
        {children}
      </span>
    </div>
  );
}
