"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastItem {
  id: number;
  type: "success" | "error";
  message: string;
}

function ToastList({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 max-w-xs ${
            t.type === "success"
              ? "bg-[var(--bg-surface)] border-[var(--state-success)] text-[var(--text-primary)]"
              : "bg-[var(--bg-surface)] border-[var(--state-error)] text-[var(--text-primary)]"
          }`}
        >
          {t.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--state-success)]" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--state-error)]" />
          )}
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

type ModalStep = "confirm" | "verify";

interface DeleteModalProps {
  petName: string;
  petId: string;
  onClose: () => void;
  onDeleted: () => void;
  onError: (message: string) => void;
}

function DeleteModal({ petName, petId, onClose, onDeleted, onError }: DeleteModalProps) {
  const [step, setStep] = useState<ModalStep>("confirm");
  const [nameInput, setNameInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const nameMatches = nameInput.trim().toLowerCase() === petName.trim().toLowerCase();

  const handleDelete = () => {
    if (!nameMatches) return;
    startTransition(async () => {
      try {
        const res = await fetch(`/api/pets/${petId}`, { method: "DELETE" });
        if (res.ok || res.status === 204) {
          onDeleted();
        } else {
          const body = await res.json().catch(() => ({})) as { error?: string };
          onError(body.error ?? "Failed to delete pet. Please try again.");
          onClose();
        }
      } catch {
        onError("Something went wrong. Please try again.");
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-50 w-full max-w-md bg-[var(--bg-surface)] rounded-2xl shadow-2xl border border-[var(--border-default)] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-brand-dark)]">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-[var(--state-error)]" />
            <h2 className="font-serif text-lg font-bold text-white">Delete Profile</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-white/60 hover:text-white transition-colors rounded-lg p-1 disabled:opacity-40"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Step 1 — initial confirmation */}
          <div className="rounded-xl bg-red-50 border border-red-100 p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-[var(--state-error)] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Are you sure you want to delete <span className="italic">{petName}</span>?
              </p>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                This will permanently remove the pet profile, all scan history, and all scheduled events. This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Step 2 — name verification (expands after clicking Yes) */}
          {step === "verify" && (
            <div className="space-y-3 pt-1">
              <p className="text-sm text-[var(--text-primary)]">
                Type <span className="font-bold">{petName}</span> to confirm deletion:
              </p>
              <Input
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={petName}
                className="border-[var(--border-default)]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && nameMatches) handleDelete();
                }}
              />
              {nameInput.length > 0 && !nameMatches && (
                <p className="text-xs text-[var(--state-error)] font-medium">
                  Name does not match.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[var(--border-default)] bg-[var(--bg-base)]">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>

          {step === "confirm" ? (
            <Button
              onClick={() => setStep("verify")}
              className="bg-[var(--state-error)] hover:opacity-90 text-white font-semibold min-w-16"
            >
              Yes, continue
            </Button>
          ) : (
            <Button
              onClick={handleDelete}
              disabled={!nameMatches || isPending}
              className="bg-[var(--state-error)] hover:opacity-90 text-white font-semibold min-w-20 disabled:opacity-40"
            >
              {isPending ? "Deleting…" : "Delete"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface DeletePetButtonProps {
  petId: string;
  petName: string;
}

let toastCounter = 0;

export default function DeletePetButton({ petId, petName }: DeletePetButtonProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (type: "success" | "error", message: string) => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auto-dismiss toasts after 4 seconds
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts]);

  const handleDeleted = () => {
    addToast("success", `${petName}'s profile has been deleted.`);
    setModalOpen(false);
    // Brief delay so the success toast is visible before redirect
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  const handleError = (message: string) => {
    addToast("error", message);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--state-error)] text-[var(--state-error)] font-semibold text-sm px-3 h-8 hover:bg-red-50 transition-colors self-start sm:self-auto"
      >
        <Trash2 className="h-4 w-4" />
        Delete Profile
      </button>

      {modalOpen && (
        <DeleteModal
          petName={petName}
          petId={petId}
          onClose={() => setModalOpen(false)}
          onDeleted={handleDeleted}
          onError={handleError}
        />
      )}

      <ToastList toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
