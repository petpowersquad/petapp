"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
  PawPrint,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Pet {
  id: string;
  name: string;
  species: string;
}

export interface CalendarEvent {
  id: string;
  pet_id: string;
  title: string;
  description: string | null;
  event_type: string;
  scheduled_at: string;
  is_completed: boolean;
  pets: { name: string; owner_id: string } | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const EVENT_TYPES = [
  { value: "play", label: "Play" },
  { value: "bath", label: "Bath" },
  { value: "vaccination", label: "Vaccination" },
  { value: "vet_visit", label: "Vet Visit" },
  { value: "grooming", label: "Grooming" },
  { value: "feeding", label: "Feeding" },
  { value: "custom", label: "Custom" },
] as const;

// Per-pet color palette — cycles through these for each unique pet
const PET_COLOR_PALETTE = [
  { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  { bg: "bg-sky-50",    text: "text-sky-700",    border: "border-sky-200",    dot: "bg-sky-500" },
  { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200",   dot: "bg-rose-500" },
  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500" },
  { bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200",   dot: "bg-teal-500" },
  { bg: "bg-fuchsia-50",text: "text-fuchsia-700",border: "border-fuchsia-200",dot: "bg-fuchsia-500" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPetColor(petId: string, petIndex: Map<string, number>) {
  const idx = petIndex.get(petId) ?? 0;
  return PET_COLOR_PALETTE[idx % PET_COLOR_PALETTE.length];
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toLocalDateString(date: Date) {
  // Format as YYYY-MM-DD in local time for datetime-local input default
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}T09:00`;
}

// ─── Add Event Modal ──────────────────────────────────────────────────────────

interface AddEventModalProps {
  pets: Pet[];
  defaultDate: Date;
  onClose: () => void;
  onCreated: (event: CalendarEvent) => void;
}

function AddEventModal({ pets, defaultDate, onClose, onCreated }: AddEventModalProps) {
  const [petId, setPetId] = useState(pets[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<string>("custom");
  const [scheduledAt, setScheduledAt] = useState(toLocalDateString(defaultDate));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!title.trim()) { setError("Title is required."); return; }
    if (!petId) { setError("Please select a pet."); return; }
    if (!scheduledAt) { setError("Scheduled date is required."); return; }

    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pet_id: petId,
            title: title.trim(),
            description: description.trim() || null,
            event_type: eventType,
            scheduled_at: new Date(scheduledAt).toISOString(),
          }),
        });
        if (!res.ok) {
          const body = (await res.json()) as { error?: string };
          throw new Error(body.error ?? "Failed to create event.");
        }
        const created = (await res.json()) as CalendarEvent;
        onCreated(created);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className="relative z-50 w-full max-w-md bg-[var(--bg-surface)] rounded-2xl shadow-2xl border border-[var(--border-default)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-brand-dark)]">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[var(--accent-primary)]" />
            <h2 className="font-serif text-lg font-bold text-white">Add Event</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors rounded-lg p-1"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {/* Pet selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-primary)]">Pet</label>
            {pets.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)]">No pets found. Add a pet from the dashboard first.</p>
            ) : (
              <Select
                value={petId}
                onValueChange={(v) => setPetId(v ?? "")}
                itemToStringLabel={(v) => pets.find((p) => p.id === v)?.name ?? String(v)}
              >
                <SelectTrigger className="w-full border-[var(--border-default)]">
                  <PawPrint className="h-4 w-4 text-[var(--accent-primary)]" />
                  <SelectValue placeholder="Select a pet…" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name}
                      <span className="ml-1.5 text-[var(--text-muted)] text-xs">· {pet.species}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-primary)]">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual vaccination"
              className="border-[var(--border-default)]"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-primary)]">Description <span className="text-[var(--text-muted)] font-normal">(optional)</span></label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional notes…"
              rows={2}
              className="border-[var(--border-default)] resize-none"
            />
          </div>

          {/* Event type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-primary)]">Event Type</label>
            <Select
              value={eventType}
              onValueChange={(v) => setEventType(v ?? "custom")}
              itemToStringLabel={(v) => EVENT_TYPES.find((t) => t.value === v)?.label ?? String(v)}
            >
              <SelectTrigger className="w-full border-[var(--border-default)]">
                <SelectValue placeholder="Select type…" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scheduled at */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-primary)]">Scheduled At</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-[var(--state-error)] font-medium">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[var(--border-default)] bg-[var(--bg-base)]">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleSave}
            disabled={isPending || pets.length === 0}
            className="font-semibold min-w-20"
          >
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main CalendarClient ──────────────────────────────────────────────────────

interface CalendarClientProps {
  initialEvents: CalendarEvent[];
  pets: Pet[];
}

export default function CalendarClient({ initialEvents, pets }: CalendarClientProps) {
  const today = new Date();

  // Build stable pet → color index map
  const petColorIndex = new Map(pets.map((p, i) => [p.id, i]));

  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [, startDelete] = useTransition();

  // ── Month navigation ───────────────────────────────────────────────────────
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  // ── Calendar grid ──────────────────────────────────────────────────────────
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const calendarCells: (number | null)[] = [
    ...Array.from({ length: firstDayOfMonth }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // ── Events by day (for the current view month) ────────────────────────────
  const eventsByDay = new Map<number, CalendarEvent[]>();
  for (const ev of events) {
    const d = new Date(ev.scheduled_at);
    if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
      const day = d.getDate();
      if (!eventsByDay.has(day)) eventsByDay.set(day, []);
      eventsByDay.get(day)!.push(ev);
    }
  }

  // ── Events for selected date ───────────────────────────────────────────────
  const selectedDayEvents = events.filter((ev) =>
    isSameDay(new Date(ev.scheduled_at), selectedDate)
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCreated = (ev: CalendarEvent) => {
    setEvents((prev) => [...prev, ev]);
    // Auto-select the day of the new event
    setSelectedDate(new Date(ev.scheduled_at));
    const d = new Date(ev.scheduled_at);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const handleDelete = (eventId: string) => {
    setDeleteError(null);
    setDeletingId(eventId);
    startDelete(async () => {
      const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
      } else {
        setDeleteError("Failed to delete event. Please try again.");
      }
      setDeletingId(null);
    });
  };

  const handleDayClick = (day: number) => {
    setSelectedDate(new Date(viewYear, viewMonth, day));
  };

  const formattedSelectedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <>
      <div className="flex-1 bg-background p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-8">

          {/* ── Page Header ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">Care Calendar</h1>
              <p className="text-sm text-text-muted">Plan vaccination schedules, medication cycles, and routine checkups.</p>
            </div>
            <Button
              variant="secondary"
              className="font-semibold gap-2 self-start sm:self-auto"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="h-4 w-4" /> Add Event
            </Button>
          </div>

          {/* ── Pet color legend ─────────────────────────────────────── */}
          {pets.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {pets.map((pet) => {
                const color = getPetColor(pet.id, petColorIndex);
                return (
                  <div key={pet.id} className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${color.dot}`} />
                    <span className="text-xs text-[var(--text-muted)] font-medium">{pet.name}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Main layout ──────────────────────────────────────────── */}
          <div className="grid gap-6 lg:grid-cols-3">

            {/* Calendar Grid */}
            <Card className="lg:col-span-2 border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-xl font-bold text-primary">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </CardTitle>
                  <CardDescription>Care planner view</CardDescription>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth} aria-label="Previous month">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth} aria-label="Next month">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day labels */}
                <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-primary mb-2">
                  {DAYS_OF_WEEK.map((d) => (
                    <div key={d} className="py-2">{d}</div>
                  ))}
                </div>

                {/* Cells */}
                <div className="grid grid-cols-7 gap-1.5">
                  {calendarCells.map((day, idx) => {
                    if (!day) {
                      return <div key={`pad-${idx}`} className="min-h-16 md:min-h-24" />;
                    }
                    const cellDate = new Date(viewYear, viewMonth, day);
                    const isToday = isSameDay(cellDate, today);
                    const isSelected = isSameDay(cellDate, selectedDate);
                    const dayEvents = eventsByDay.get(day) ?? [];

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayClick(day)}
                        className={`min-h-16 md:min-h-24 p-1.5 rounded-xl border flex flex-col gap-1 text-left transition-colors w-full ${
                          isSelected
                            ? "bg-[var(--bg-brand-dark)] border-[var(--bg-brand-dark)] text-white"
                            : isToday
                            ? "bg-amber-50/55 border-[var(--accent-primary)]"
                            : "bg-card border-border hover:bg-slate-50/80"
                        }`}
                        aria-label={`${MONTH_NAMES[viewMonth]} ${day}`}
                        aria-pressed={isSelected}
                      >
                        <span className={`text-xs font-semibold ${
                          isSelected ? "text-white" : isToday ? "text-[var(--accent-primary)]" : "text-primary"
                        }`}>
                          {day}
                        </span>
                        <div className="space-y-0.5 w-full">
                          {dayEvents.slice(0, 2).map((ev) => {
                            const color = getPetColor(ev.pet_id, petColorIndex);
                            return (
                              <div
                                key={ev.id}
                                className={`text-[9px] truncate px-1 py-0.5 rounded font-medium border ${
                                  isSelected ? "bg-white/20 text-white border-white/30" : `${color.bg} ${color.text} ${color.border}`
                                }`}
                              >
                                {ev.pets?.name ? `${ev.pets.name}: ${ev.title}` : ev.title}
                              </div>
                            );
                          })}
                          {dayEvents.length > 2 && (
                            <div className={`text-[9px] px-1 font-medium ${isSelected ? "text-white/70" : "text-[var(--text-muted)]"}`}>
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Agenda / Schedule panel */}
            <Card className="border-border shadow-sm flex flex-col">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-lg font-bold text-primary">Schedule for Day</CardTitle>
                <CardDescription className="capitalize">{formattedSelectedDate}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pt-4 p-0">
                {selectedDayEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-3">
                    <CalendarIcon className="h-8 w-8 text-[var(--text-muted)]" />
                    <p className="text-sm text-[var(--text-muted)]">No events scheduled for this day.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 font-semibold"
                      onClick={() => setModalOpen(true)}
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Event
                    </Button>
                  </div>
                ) : (
                  <>
                    {deleteError && (
                      <p className="px-4 pt-3 text-xs text-[var(--state-error)] font-medium">{deleteError}</p>
                    )}
                  <ScrollArea className="h-96 px-4 pt-0">
                    <div className="space-y-3 py-4">
                      {selectedDayEvents.map((ev) => {
                        const color = getPetColor(ev.pet_id, petColorIndex);
                        return (
                          <div
                            key={ev.id}
                            className="flex gap-3 items-start p-3 rounded-xl border border-[var(--border-default)] bg-card hover:shadow-sm transition-all duration-200"
                          >
                            <div className={`mt-0.5 p-1.5 rounded-lg border ${color.bg} ${color.border}`}>
                              <CalendarIcon className={`h-4 w-4 ${color.text}`} />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-xs font-semibold text-primary leading-tight">{ev.title}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(ev.id)}
                                  disabled={deletingId === ev.id}
                                  className="shrink-0 text-[var(--text-muted)] hover:text-[var(--state-error)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                  aria-label={`Delete ${ev.title}`}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                {ev.pets?.name && (
                                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${color.bg} ${color.text} ${color.border}`}>
                                    {ev.pets.name}
                                  </span>
                                )}
                                <span className="text-[10px] text-[var(--text-muted)] capitalize">
                                  {ev.event_type.replace("_", " ")}
                                </span>
                              </div>
                              {ev.description && (
                                <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">{ev.description}</p>
                              )}
                              <div className="text-[10px] text-[var(--text-muted)]">
                                {new Date(ev.scheduled_at).toLocaleTimeString("en-US", {
                                  hour: "numeric", minute: "2-digit", hour12: true,
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {modalOpen && (
        <AddEventModal
          pets={pets}
          defaultDate={selectedDate}
          onClose={() => setModalOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  );
}
