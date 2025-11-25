import Link from "next/link";
import { Button } from "@/components/ui";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-bg-light">
      <div className="text-center space-y-8 max-w-3xl">
        <h1 className="text-5xl font-bold text-primary">Archer</h1>

        <p className="text-2xl text-text-primary font-medium">
          Align your daily tasks with your long-term goals
        </p>

        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          AI-powered productivity platform for students and young professionals.
          Focus on alignment, not just completion.
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Link href="/signup">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-12 border-t border-border-light">
          <p className="text-sm text-text-muted">
            Phase 5: Authentication System Complete ✓
          </p>
        </div>
      </div>
    </main>
  );
}
