"use client";

import React, { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Camera, Loader2, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PetImageUploadProps {
  petId: string;
  petName: string;
  photoUrl: string | null;
}

export default function PetImageUpload({
  petId,
  petName,
  photoUrl,
}: PetImageUploadProps) {
  const [currentUrl, setCurrentUrl] = useState<string | null>(photoUrl);
  const [uploading, startUpload] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic client-side validation
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }

    setError(null);

    startUpload(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`/api/pets/${petId}/upload-photo`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const body = (await res.json()) as { error?: string };
          throw new Error(body.error ?? "Upload failed");
        }

        const body = (await res.json()) as { photo_url: string };
        setCurrentUrl(body.photo_url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        // Reset so selecting the same file again triggers onChange
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  }

  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <CardContent className="p-0 relative group -mb-4 -mt-4">
        {currentUrl ? (
          /* ── Has photo ─────────────────────────────────── */
          <div className="relative aspect-square w-full">
            <Image
              src={currentUrl}
              alt={`Photo of ${petName}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                className="gap-1.5 shadow-sm"
                onClick={handleClick}
                disabled={uploading}
                aria-label="Change pet photo"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                {uploading ? "Uploading…" : "Change Photo"}
              </Button>
            </div>
          </div>
        ) : (
          /* ── No photo placeholder ───────────────────────── */
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            aria-label="Upload a photo of your pet"
            className="flex aspect-square w-full flex-col items-center justify-center gap-3 bg-[var(--bg-base)] hover:bg-slate-100 transition-colors cursor-pointer border-0 rounded-[inherit] p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {uploading ? (
              <>
                <Loader2 className="h-10 w-10 text-text-muted animate-spin" />
                <p className="text-sm text-text-muted font-medium">Uploading…</p>
              </>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-primary)]/10">
                  <Upload className="h-7 w-7 text-secondary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-primary">
                    Upload {petName}&apos;s Photo
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    JPEG, PNG or WebP · max 5 MB
                  </p>
                </div>
              </>
            )}
          </button>
        )}

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleChange}
          aria-hidden="true"
        />
      </CardContent>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100">
          <p className="text-xs text-state-error font-medium">{error}</p>
        </div>
      )}
    </Card>
  );
}
