import Link from "next/link";
import { PawPrint } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/10 bg-primary text-white py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Brand info */}
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-secondary/10 p-1">
              <PawPrint className="h-4 w-4 text-secondary" />
            </div>
            <span className="font-serif text-sm font-semibold tracking-tight text-white/90">
              PAWPower
            </span>
            <span className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} PAWPower. All rights reserved.
            </span>
          </div>

          {/* Right: Footer Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-text-muted">
            <Link href="/privacy" className="hover:text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-secondary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-secondary transition-colors">
              Support
            </Link>
            <Link href="#" className="hover:text-secondary transition-colors">
              Vet Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
