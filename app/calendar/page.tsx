import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, MapPin, CheckCircle2 } from "lucide-react";

export default function CalendarPage() {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Generating a simple mock grid of days in a month (July 2026)
  // July 1st, 2026 is a Wednesday (start offset of 3)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: 3 }, () => null);
  const calendarCells = [...paddingDays, ...daysInMonth];

  // Events mapped to specific days
  const eventsByDay: Record<number, Array<{ title: string; pet: string; type: string }>> = {
    1: [{ title: "Flea treatment", pet: "Luna", type: "med" }],
    9: [{ title: "Vaccination", pet: "Max", type: "vet" }],
    15: [{ title: "Grooming", pet: "Luna", type: "care" }],
    24: [{ title: "Weight check", pet: "Max", type: "check" }],
  };

  const scheduleList = [
    { time: "09:00 AM", title: "Max Annual Rabies Vaccination", pet: "Max", location: "Green Valley Vet Hospital", type: "vet" },
    { time: "01:00 PM", title: "Flea & Tick Treatment", pet: "Luna", location: "Home", type: "med" },
    { time: "05:00 PM", title: "Evening walk & basic training", pet: "Max", location: "Central Park", type: "care" },
  ];

  return (
    <div className="flex-1 bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">Care Calendar</h1>
            <p className="text-sm text-text-muted">Plan vaccination schedules, medication cycles, and routine checkups.</p>
          </div>
          <Button variant="secondary" className="font-semibold gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" /> Add Event
          </Button>
        </div>

        {/* Content Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Calendar Grid */}
          <Card className="lg:col-span-2 border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl font-bold text-primary">July 2026</CardTitle>
                <CardDescription>Care planner view</CardDescription>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Days header */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-primary mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="py-2">{day}</div>
                ))}
              </div>

              {/* Calendar cells */}
              <div className="grid grid-cols-7 gap-1.5">
                {calendarCells.map((day, idx) => {
                  const dayEvents = day ? eventsByDay[day] : undefined;
                  const isCurrentDay = day === 9; // Let's mock today as July 9, 2026
                  return (
                    <div
                      key={idx}
                      className={`min-h-16 md:min-h-24 p-1.5 rounded-xl border flex flex-col justify-between transition-colors ${
                        !day 
                          ? "bg-muted/10 border-transparent text-transparent" 
                          : isCurrentDay
                          ? "bg-amber-50/55 border-secondary text-primary font-semibold"
                          : "bg-card border-border hover:bg-slate-50/50"
                      }`}
                    >
                      <span className={`text-xs ${isCurrentDay ? "text-secondary font-extrabold" : "text-primary"}`}>
                        {day}
                      </span>
                      {dayEvents && (
                        <div className="space-y-1">
                          {dayEvents.map((ev, eIdx) => (
                            <div
                              key={eIdx}
                              className={`text-[9px] truncate px-1 py-0.5 rounded font-medium border ${
                                ev.type === "vet" ? "bg-red-50 text-red-600 border-red-100" :
                                ev.type === "med" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                "bg-emerald-50 text-emerald-600 border-emerald-100"
                              }`}
                            >
                              {ev.pet}: {ev.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Agenda view */}
          <Card className="border-border shadow-sm flex flex-col">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-lg font-bold text-primary">Schedule for Today</CardTitle>
              <CardDescription>Thursday, July 9, 2026</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 pt-4">
              {scheduleList.map((item, idx) => (
                <div key={idx} className="flex gap-3.5 items-start p-3 rounded-xl border border-border bg-card hover:shadow-sm transition-all duration-200">
                  <div className={`mt-0.5 p-1.5 rounded-lg border ${
                    item.type === "vet" ? "bg-red-50 text-red-600 border-red-100" :
                    item.type === "med" ? "bg-amber-50 text-amber-600 border-amber-100" :
                    "bg-emerald-50 text-emerald-600 border-emerald-100"
                  }`}>
                    <CalendarIcon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="text-xs font-semibold text-primary">{item.title}</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                      <Clock className="h-3 w-3" /> {item.time}
                    </div>
                    {item.location !== "Home" && (
                      <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                        <MapPin className="h-3 w-3" /> {item.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
