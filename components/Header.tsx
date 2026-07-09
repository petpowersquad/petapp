"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PawPrint, Menu, X } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "About", href: "/about" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Calendar", href: "/calendar" },
  { name: "Vet Finder", href: "/vets" },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-primary text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="rounded-lg bg-secondary p-1.5 transition-transform duration-200 group-hover:scale-105">
                <PawPrint className="h-5 w-5 text-primary" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-secondary">
                PAWPower
              </span>
            </Link>
          </div>

          {/* Center/Right: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-all duration-200 hover:text-secondary py-1 relative",
                    isActive ? "text-secondary font-semibold" : "text-white/85"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-secondary rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Scan Pet CTA */}
            <Link
              href="/scan"
              className={buttonVariants({
                variant: "secondary",
                size: "sm",
                className:
                  "ml-2 font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] hover:text-secondary transition-all",
              })}
            >
              Scan Pet
            </Link>
          </nav>

          {/* Far Right: Auth Controls — Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="h-8 w-px bg-white/20" />

            {/* Signed-out: Sign In + Sign Up buttons */}
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-white/80 hover:text-secondary transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm font-semibold bg-secondary text-primary px-4 py-1.5 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>

            {/* Signed-in: User avatar button */}
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "h-8 w-8 ring-2 ring-secondary/60 hover:ring-secondary transition-all",
                  },
                }}
              />
            </Show>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-primary px-4 py-4 space-y-3 shadow-inner animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    isActive
                      ? "bg-white/10 text-secondary"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/scan"
              onClick={() => setIsOpen(false)}
              className={buttonVariants({
                variant: "secondary",
                className: "w-full justify-center font-semibold",
              })}
            >
              Scan Pet
            </Link>

            {/* Mobile Auth Controls */}
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm font-medium text-white/80 hover:text-secondary transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm font-semibold bg-secondary text-primary px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                >
                  Sign Up
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-3 px-3 py-2">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "h-8 w-8 ring-2 ring-secondary/60 hover:ring-secondary transition-all",
                    },
                  }}
                />
                <span className="text-sm font-medium text-white/80">
                  My Account
                </span>
              </div>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
