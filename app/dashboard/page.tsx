import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Activity, Calendar as CalendarIcon, History, Plus, Heart } from "lucide-react";

export default function Dashboard() {
  // Mock data for pets
  const pets = [
    { name: "Max", species: "Dog", breed: "Golden Retriever", age: "2 years", status: "Healthy" },
    { name: "Luna", species: "Cat", breed: "Siamese", age: "1 year", status: "Requires Scan" },
  ];

  // Mock data for tasks
  const tasks = [
    { id: 1, pet: "Max", task: "Annual rabies vaccination", due: "Today", category: "Vet Visit", priority: "high" },
    { id: 2, pet: "Luna", task: "Flea and tick treatment", due: "Tomorrow", category: "Medication", priority: "medium" },
    { id: 3, pet: "Max", task: "Evening walk & exercise", due: "5:00 PM", category: "Routine", priority: "low" },
  ];

  // Mock scan history
  const recentScans = [
    { pet: "Luna", date: "July 08, 2026", result: "Slight ear redness, suggested monitoring", status: "warning" },
    { pet: "Max", date: "June 25, 2026", result: "Skin scan clear, no anomalies detected", status: "success" },
  ];

  return (
    <div className="flex-1 bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">Pet Dashboard</h1>
            <p className="text-sm text-text-muted">Manage your pets, track health alerts, and check off daily care tasks.</p>
          </div>
          <Button variant="secondary" className="font-semibold gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" /> Add Pet Profile
          </Button>
        </div>

        {/* Overview Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Pets List */}
          <Card className="md:col-span-2 border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-bold text-primary">Your Pets</CardTitle>
                <CardDescription>Active registered pets under your account</CardDescription>
              </div>
              <Heart className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                {pets.map((pet) => (
                  <div key={pet.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all duration-200">
                    <div>
                      <div className="font-semibold text-primary">{pet.name}</div>
                      <div className="text-xs text-text-muted">{pet.breed} • {pet.age}</div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      pet.status === "Healthy" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                    }`}>
                      {pet.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Card */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-bold text-primary">AI Health Insights</CardTitle>
              </div>
              <CardDescription>Model evaluations from latest uploads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="rounded-xl bg-amber-50 p-4 border border-amber-100 text-amber-900 text-xs leading-relaxed dark:bg-amber-950/10 dark:border-amber-900/20 dark:text-amber-200">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertTriangle className="h-4 w-4 text-state-warning" /> Luna requires an ear scan
                </div>
                Based on scan history, Luna has a recurring warning flag. Consider uploading a close-up photo of her right ear.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Checklist & Scan History Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Checklist */}
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-bold text-primary">Care Checklist</CardTitle>
                <CardDescription>Actionable tasks for today</CardDescription>
              </div>
              <CalendarIcon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <button
                      className="text-text-muted hover:text-primary transition-colors"
                      aria-label={`Mark "${task.task}" as complete`}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </button>
                    <div>
                      <div className="text-sm font-medium text-primary">{task.task}</div>
                      <div className="text-xs text-text-muted">{task.pet} • {task.category}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    task.priority === "high" ? "bg-red-50 text-red-600 border border-red-100" :
                    task.priority === "medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                    "bg-slate-50 text-slate-500 border border-slate-100"
                  }`}>
                    {task.due}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Scans */}
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-bold text-primary">Recent AI Scans</CardTitle>
                <CardDescription>History of triage checks</CardDescription>
              </div>
              <History className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {recentScans.map((scan, idx) => (
                <div key={idx} className="p-3.5 rounded-lg border border-border bg-card hover:bg-slate-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-semibold text-primary">{scan.pet}</span>
                    <span className="text-xs text-text-muted">{scan.date}</span>
                  </div>
                  <p className="text-xs text-text-muted">{scan.result}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <span className={`h-2 w-2 rounded-full ${scan.status === "success" ? "bg-state-success" : "bg-state-warning"}`} />
                    <span className="text-[10px] font-medium text-text-muted uppercase">{scan.status} triage</span>
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
