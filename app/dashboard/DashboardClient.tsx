"use client";

import { useState, useRef, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity, AlertTriangle, Calendar as CalendarIcon, CheckCircle2,
  Circle, Heart, History, ImageIcon, Plus, Scan, Upload, X,
  ClipboardList, PawPrint,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Pet {
  id: string;
  name: string;
  species: string;
  age: number | null;
  age_unit: string | null;
  weight_kg: number | null;
  photo_url: string | null;
  breeds: { name: string }[] | null;
}

export interface HealthScan {
  id: string;
  pet_id: string;
  scan_type: string;
  photo_url: string;
  raw_response: Record<string, unknown>;
  created_at: string;
  // Supabase returns joined rows as an array; we use index [0]
  pets: { name: string }[] | null;
}

export interface PetEvent {
  id: string;
  pet_id: string;
  title: string;
  description: string | null;
  event_type: string;
  scheduled_at: string;
  is_completed: boolean;
  // Supabase returns joined rows as an array; we use index [0]
  pets: { name: string }[] | null;
}

// ─── Toast ───────────────────────────────────────────────────────────────────

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-xs w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg text-sm font-medium animate-in slide-in-from-bottom-2 duration-200 ${
            t.type === "success"
              ? "bg-white border-[var(--state-success)] text-[var(--text-primary)]"
              : "bg-white border-[var(--state-error)] text-[var(--state-error)]"
          }`}
        >
          <span className="mt-0.5 shrink-0">
            {t.type === "success"
              ? <CheckCircle2 className="h-4 w-4 text-[var(--state-success)]" />
              : <AlertTriangle className="h-4 w-4 text-[var(--state-error)]" />}
          </span>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onDismiss(t.id)} aria-label="Dismiss" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Add Pet Modal ────────────────────────────────────────────────────────────

interface AddPetModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (pet: Pet, imageObjectUrl: string | null) => void;
  onToast: (type: "success" | "error", message: string) => void;
}

const BUCKET = "pet-images";

function AddPetModal({ open, onClose, onSuccess, onToast }: AddPetModalProps) {
  const [mode, setMode] = useState<"manual" | "image">("manual");
  const [name, setName] = useState("");
  const [species, setSpecies] = useState<"dog" | "cat" | "other">("dog");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [ageUnit, setAgeUnit] = useState<"years" | "months">("years");
  const [weight, setWeight] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, startSubmit] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback((skipRevoke = false) => {
    setMode("manual");
    setName(""); setSpecies("dog"); setBreed(""); setAge(""); setAgeUnit("years"); setWeight("");
    setImageFile(null);
    if (!skipRevoke && imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setUploadProgress(0);
    setIsUploading(false);
  }, [imagePreview]);

  const handleClose = () => { resetForm(); onClose(); };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      onToast("error", "Only JPEG and PNG images are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onToast("error", "Image must be under 5 MB.");
      return;
    }
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadProgress(0);
  };

  const uploadImageToStorage = async (petId: string): Promise<string | null> => {
    if (!imageFile) return null;
    setIsUploading(true);
    setUploadProgress(10);

    // Simulate chunked progress feedback while XHR uploads
    const interval = setInterval(() => {
      setUploadProgress((p) => (p < 85 ? p + 15 : p));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      const res = await fetch(`/api/pets/${petId}/upload-photo`, { method: "POST", body: formData });
      clearInterval(interval);
      if (!res.ok) {
        const body = await res.json() as { error?: string };
        throw new Error(body.error ?? "Upload failed");
      }
      const body = await res.json() as { photo_url: string };
      setUploadProgress(100);
      return body.photo_url;
    } catch (err) {
      clearInterval(interval);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { onToast("error", "Pet name is required."); return; }

    startSubmit(async () => {
      try {
        // 1. Create pet row (no photo yet)
        const res = await fetch("/api/pets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            species,
            age: age ? parseFloat(age) : null,
            age_unit: age ? ageUnit : null,
            weight_kg: weight ? parseFloat(weight) : null,
          }),
        });
        if (!res.ok) {
          const body = await res.json() as { error?: string };
          throw new Error(body.error ?? "Failed to create pet.");
        }
        const newPet = await res.json() as { id: string; name: string; species: string; photo_url: string | null };

        // 2. Upload photo if provided
        let finalPhotoUrl: string | null = null;
        if (imageFile) {
          finalPhotoUrl = await uploadImageToStorage(newPet.id);
        }

        const petForCallback: Pet = {
          id: newPet.id,
          name: newPet.name,
          species: newPet.species,
          age: age ? parseFloat(age) : null,
          age_unit: age ? ageUnit : null,
          weight_kg: weight ? parseFloat(weight) : null,
          photo_url: finalPhotoUrl,
          breeds: breed ? [{ name: breed }] : null,
        };

        onToast("success", `${newPet.name}'s profile created successfully!`);
        onSuccess(petForCallback, imagePreview);
        // Pass skipRevoke=true: the blob URL was forwarded to the scan page,
        // which owns cleanup via its own revokeAndClear guard.
        resetForm(true);
        onClose();
      } catch (err) {
        console.log(err instanceof Error ? err.message : "Something went wrong.");
        onToast("error", err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-50 w-full max-w-lg bg-[var(--bg-surface)] rounded-2xl shadow-2xl border border-[var(--border-default)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-brand-dark)]">
          <div className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-[var(--accent-primary)]" />
            <h2 className="font-serif text-lg font-bold text-white">Add Pet Profile</h2>
          </div>
          <button onClick={handleClose} className="text-white/60 hover:text-white transition-colors rounded-lg p-1" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode selector */}
        <div className="flex gap-0 border-b border-[var(--border-default)]">
          {(["manual", "image"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                mode === m
                  ? "border-[var(--accent-primary)] text-[var(--text-primary)] bg-[var(--bg-base)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-white"
              }`}
            >
              {m === "manual" ? <><ClipboardList className="h-4 w-4" /> Manual Input</> : <><Scan className="h-4 w-4" /> AI Scan (Image)</>}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 pt-4 pb-2 space-y-3">
            {/* Image upload section (shown in image mode, or as optional in manual) */}
            {mode === "image" && (
              <div className="space-y-2">
                {!imagePreview ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[var(--border-default)] rounded-xl py-6 text-[var(--text-muted)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-colors bg-[var(--bg-base)]"
                  >
                    <Upload className="h-8 w-8" />
                    <span className="text-sm font-medium">Click to upload pet photo</span>
                    <span className="text-xs">JPEG or PNG · max 5 MB</span>
                  </button>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-[var(--border-default)] bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Pet preview" className="w-full max-h-40 object-cover" />
                    <button
                      type="button"
                      onClick={() => { if (imagePreview) URL.revokeObjectURL(imagePreview); setImagePreview(null); setImageFile(null); setUploadProgress(0); }}
                      className="absolute top-2 right-2 bg-[var(--bg-brand-dark)] text-white rounded-full p-1 hover:opacity-80 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                {/* Progress bar */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-[var(--text-muted)]">
                      <span>Uploading…</span><span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[var(--border-default)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--accent-primary)] rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="sr-only" onChange={handleFileSelect} />
                <p className="text-xs text-[var(--text-muted)] italic">AI fill-in is coming soon. Enter info manually for now.</p>
              </div>
            )}

            {/* Form fields — always shown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold text-[var(--text-primary)]">Pet Name <span className="text-[var(--state-error)]">*</span></label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Max" required className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-primary)]">Species <span className="text-[var(--state-error)]">*</span></label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value as "dog" | "cat" | "other")}
                  className="h-9 w-full rounded-lg border border-[var(--border-default)] bg-transparent px-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-primary)]">Breed</label>
                <Input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="e.g. Labrador" className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-primary)]">Age</label>
                <div className="flex gap-1.5">
                  <Input value={age} onChange={(e) => setAge(e.target.value)} placeholder="2" type="number" min="0" step="0.1" className="h-9 text-sm w-16 shrink-0" />
                  <select
                    value={ageUnit}
                    onChange={(e) => setAgeUnit(e.target.value as "years" | "months")}
                    className="h-9 flex-1 rounded-lg border border-[var(--border-default)] bg-transparent px-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-primary)]">Weight (kg)</label>
                <Input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="4.5" type="number" min="0" step="0.1" className="h-9 text-sm" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border-default)] bg-[var(--bg-base)]">
            <button type="button" onClick={handleClose} className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5">
              Cancel
            </button>
            <Button
              type="submit"
              variant="secondary"
              disabled={isSubmitting || isUploading}
              className="font-semibold gap-1.5"
            >
              {isSubmitting || isUploading ? "Saving…" : <><Plus className="h-4 w-4" /> Create Profile</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Care Checklist ───────────────────────────────────────────────────────────

function CareChecklist({
  initialEvents,
  onToast,
}: {
  initialEvents: PetEvent[];
  onToast: (type: "success" | "error", message: string) => void;
}) {
  const [events, setEvents] = useState<PetEvent[]>(initialEvents);
  const [activeTab, setActiveTab] = useState("todo");

  const todo = events.filter((e) => !e.is_completed);
  const done = events.filter((e) => e.is_completed);

  const toggle = async (id: string, current: boolean) => {
    // Optimistic update
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, is_completed: !current } : e))
    );
    try {
      const res = await fetch(`/api/events/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: !current }),
      });
      if (!res.ok) {
        throw new Error(`Update failed (${res.status})`);
      }
    } catch {
      // Roll back on network error or non-2xx response
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, is_completed: current } : e))
      );
      onToast("error", "Could not update event. Please try again.");
    }
  };

  const EVENT_COLORS: Record<string, string> = {
    vaccination: "bg-red-50 text-red-600 border-red-100",
    vet_visit: "bg-purple-50 text-purple-700 border-purple-100",
    grooming: "bg-pink-50 text-pink-700 border-pink-100",
    bath: "bg-cyan-50 text-cyan-700 border-cyan-100",
    play: "bg-blue-50 text-blue-700 border-blue-100",
    feeding: "bg-green-50 text-green-700 border-green-100",
    custom: "bg-slate-50 text-slate-600 border-slate-200",
  };

  const renderItem = (ev: PetEvent) => (
    <div
      key={ev.id}
      className={`flex items-center justify-between p-3 rounded-lg border border-[var(--border-default)] bg-card hover:bg-slate-50/50 transition-colors ${ev.is_completed ? "opacity-60" : ""}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => toggle(ev.id, ev.is_completed)}
          className="shrink-0 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
          aria-label={ev.is_completed ? "Mark incomplete" : "Mark complete"}
        >
          {ev.is_completed
            ? <CheckCircle2 className="h-5 w-5 text-[var(--state-success)]" />
            : <Circle className="h-5 w-5" />}
        </button>
        <div className="min-w-0">
          <div className={`text-sm font-medium text-[var(--text-primary)] ${ev.is_completed ? "line-through text-[var(--text-muted)]" : ""}`}>
            {ev.title}
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            {ev.pets?.[0]?.name ?? "Unknown"} · {new Date(ev.scheduled_at).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}
          </div>
        </div>
      </div>
      <span className={`shrink-0 ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${EVENT_COLORS[ev.event_type] ?? EVENT_COLORS.custom}`}>
        {ev.event_type.replace("_", " ")}
      </span>
    </div>
  );

  return (
    <Card className="border-[var(--border-default)] shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-bold text-[var(--text-primary)]">Care Checklist</CardTitle>
          <CardDescription>Upcoming tasks for your pets</CardDescription>
        </div>
        <CalendarIcon className="h-5 w-5 text-[var(--text-primary)]" />
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {/* Tab switcher */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mx-1 mt-1 mb-0 bg-[var(--border-default)]" style={{ width: "calc(100% - 0.5rem)" }}>
            <TabsTrigger
              value="todo"
              className="flex-1 data-[state=active]:bg-[var(--bg-brand-dark)] data-[state=active]:text-white data-[state=inactive]:text-[var(--text-muted)]"
            >
              To Do {todo.length > 0 && <span className="ml-1.5 text-[10px] font-bold bg-[var(--accent-primary)] text-[var(--text-primary)] px-1.5 py-0.5 rounded-full">{todo.length}</span>}
            </TabsTrigger>
            <TabsTrigger
              value="done"
              className="flex-1 data-[state=active]:bg-[var(--bg-brand-dark)] data-[state=active]:text-white data-[state=inactive]:text-[var(--text-muted)]"
            >
              Completed {done.length > 0 && <span className="ml-1.5 text-[10px] font-bold bg-slate-200 text-[var(--text-muted)] px-1.5 py-0.5 rounded-full">{done.length}</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todo" className="mt-3">
            {todo.length === 0 ? (
              <EmptyState icon={<CheckCircle2 className="h-8 w-8 text-[var(--text-muted)]" />} message="All tasks completed! Great job." />
            ) : (
              <ScrollArea className="h-56">
                <div className="space-y-2 pr-3">{todo.map(renderItem)}</div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="done" className="mt-3">
            {done.length === 0 ? (
              <EmptyState icon={<Circle className="h-8 w-8 text-[var(--text-muted)]" />} message="No completed tasks yet." />
            ) : (
              <ScrollArea className="h-56">
                <div className="space-y-2 pr-3">{done.map(renderItem)}</div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ─── Recent Scans ─────────────────────────────────────────────────────────────

function RecentScans({ scans }: { scans: HealthScan[] }) {
  return (
    <Card className="border-[var(--border-default)] shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-bold text-[var(--text-primary)]">Recent AI Scans</CardTitle>
          <CardDescription>History of triage checks across all pets</CardDescription>
        </div>
        <History className="h-5 w-5 text-[var(--text-primary)]" />
      </CardHeader>
      <CardContent className="pt-2">
        {scans.length === 0 ? (
          <EmptyState
            icon={<ImageIcon className="h-8 w-8 text-[var(--text-muted)]" />}
            message="No scans yet. Upload a pet photo to run your first triage check."
          />
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-3 pr-3">
              {scans.map((scan) => {
                const raw = scan.raw_response;
                const summary = typeof raw?.summary === "string" ? raw.summary : typeof raw?.result === "string" ? raw.result : "Scan completed.";
                const status = typeof raw?.status === "string" ? raw.status : "success";
                return (
                  <div key={scan.id} className="p-3.5 rounded-lg border border-[var(--border-default)] bg-card hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{scan.pets?.[0]?.name ?? "Unknown"}</span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {new Date(scan.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2">{summary}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <span className={`h-2 w-2 rounded-full ${status === "success" || status === "healthy" ? "bg-[var(--state-success)]" : status === "warning" ? "bg-[var(--state-warning)]" : "bg-[var(--state-error)]"}`} />
                      <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase">{status} triage</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Health Insights ──────────────────────────────────────────────────────────

function HealthInsights({ scans }: { scans: HealthScan[] }) {
  const warnings = scans.filter((s) => {
    const status = s.raw_response?.status;
    return status === "warning" || status === "critical";
  });

  return (
    <Card className="border-[var(--border-default)] shadow-sm flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-[var(--text-primary)]" />
          <CardTitle className="text-lg font-bold text-[var(--text-primary)]">AI Health Insights</CardTitle>
        </div>
        <CardDescription>Model evaluations from latest uploads</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 flex-1">
        {warnings.length === 0 ? (
          <EmptyState
            icon={<Activity className="h-8 w-8 text-[var(--text-muted)]" />}
            message="No active health alerts. All pets look good!"
          />
        ) : (
          <ScrollArea className="h-full min-h-[8rem]">
            <div className="space-y-3 pr-3">
              {warnings.slice(0, 5).map((scan) => {
                const raw = scan.raw_response;
                const summary = typeof raw?.summary === "string" ? raw.summary : typeof raw?.insight === "string" ? raw.insight : "Requires attention.";
                return (
                  <div key={scan.id} className="rounded-xl bg-amber-50 p-4 border border-amber-100 text-amber-900 text-xs leading-relaxed">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <AlertTriangle className="h-4 w-4 text-[var(--state-warning)]" />
                      {scan.pets?.[0]?.name ?? "A pet"} requires attention
                    </div>
                    <p>{summary}</p>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Shared Empty State ───────────────────────────────────────────────────────

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
      <div className="text-[var(--text-muted)]">{icon}</div>
      <p className="text-sm text-[var(--text-muted)]">{message}</p>
    </div>
  );
}

// ─── Main Dashboard Client ────────────────────────────────────────────────────

interface DashboardClientProps {
  initialPets: Pet[];
  initialScans: HealthScan[];
  initialEvents: PetEvent[];
}

export default function DashboardClient({ initialPets, initialScans, initialEvents }: DashboardClientProps) {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [scans] = useState<HealthScan[]>(initialScans);
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCounter = useRef(0);

  const addToast = (type: "success" | "error", message: string) => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  };

  const dismissToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const handlePetCreated = (pet: Pet, imageObjectUrl: string | null) => {
    setPets((prev) => [...prev, pet]);
    if (imageObjectUrl) {
      router.push(`/scan?preview=${encodeURIComponent(imageObjectUrl)}`);
    } else {
      router.push("/scan");
    }
  };

  return (
    <>
      <div className="flex-1 bg-background p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">

          {/* Welcome Banner */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">Pet Dashboard</h1>
              <p className="text-sm text-text-muted">Manage your pets, track health alerts, and check off daily care tasks.</p>
            </div>
            <Button variant="secondary" className="font-semibold gap-2 self-start sm:self-auto" onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" /> Add Pet Profile
            </Button>
          </div>

          {/* Overview Grid — Pets + Insights */}
          <div className="grid gap-6 md:grid-cols-3 md:items-stretch">
            {/* Pets — spans 2 cols, no scroll, extends naturally */}
            <Card className="md:col-span-2 border-[var(--border-default)] shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-bold text-[var(--text-primary)]">Your Pets</CardTitle>
                  <CardDescription>Active registered pets under your account</CardDescription>
                </div>
                <Heart className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                {pets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                    <PawPrint className="h-10 w-10 text-[var(--text-muted)]" />
                    <p className="text-sm text-[var(--text-muted)]">You haven&apos;t added any pets yet.</p>
                    <Button variant="secondary" className="font-semibold gap-2" onClick={() => setModalOpen(true)}>
                      <Plus className="h-4 w-4" /> Add Your First Pet
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 pt-2">
                    {pets.map((pet) => (
                      <Link
                        key={pet.id}
                        href={`/pets/${pet.id}`}
                        className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-brand-dark)] hover:opacity-90 transition-all duration-200 no-underline"
                      >
                        <div>
                          <div className="font-semibold text-white">{pet.name}</div>
                          <div className="text-xs text-white/60 capitalize">
                            {pet.breeds?.[0]?.name ?? pet.species}
                            {pet.age ? ` · ${pet.age} ${pet.age_unit ?? "yr"}` : ""}
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--accent-primary)] text-[var(--text-primary)]">
                          Active
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Insights — matches height of pets card */}
            <div className="h-full">
              <HealthInsights scans={scans} />
            </div>
          </div>

          {/* Checklist & Scans */}
          <div className="grid gap-6 md:grid-cols-2">
            <CareChecklist initialEvents={initialEvents} onToast={addToast} />
            <RecentScans scans={scans} />
          </div>

        </div>
      </div>

      {/* Add Pet Modal */}
      <AddPetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handlePetCreated}
        onToast={addToast}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
