"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload, Camera, FileImage, ShieldAlert, Sparkles, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

function ScanPageInner() {
  const searchParams = useSearchParams();
  const previewParam = searchParams.get("preview");

  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(previewParam);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<boolean>(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Revoke the blob URL on unmount — covers both the transferred previewParam
  // blob and any locally-created blob that was never explicitly cleared.
  useEffect(() => {
    return () => {
      setSelectedImage((prev) => {
        if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
        return prev;
      });
    };
  }, []);

  const revokeAndClear = () => {
    setSelectedImage((prev) => {
      // Revoke all blob URLs — including the transferred previewParam blob,
      // which this component now owns.
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith("image/")) return;
      setSelectedImage((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
    }
  };

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(true);
    }, 2500); // Mock scan processing delay
  };

  const resetScanner = () => {
    revokeAndClear();
    setScanResult(false);
  };

  return (
    <div className="flex-1 bg-background p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">AI Health Triage</h1>
          <p className="text-sm text-text-muted">
            Upload a clear close-up photo of your pet&apos;s symptom (skin, eyes, ears, etc.) for instant triage suggestions.
          </p>
        </div>

        {!scanResult ? (
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-primary text-white pb-6 pt-8 text-center gap-0 -mx-6 -mt-6 mb-6">
              <Sparkles className="h-8 w-8 text-secondary mx-auto mb-2" />
              <CardTitle className="text-xl font-bold">Image Upload Portal</CardTitle>
              <CardDescription className="text-white/60">Supported formats: JPEG, PNG</CardDescription>
            </CardHeader>
            <CardContent className="-mt-6">
              {!selectedImage ? (
                // Drag & Drop Area
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                    dragActive 
                      ? "border-secondary bg-amber-50/10" 
                      : "border-border bg-slate-50/30 hover:bg-slate-50/50"
                  }`}
                >
                  <Upload className="h-10 w-10 text-text-muted mb-4" />
                  <p className="text-sm font-semibold text-primary mb-1">Drag and drop your image here</p>
                  <p className="text-xs text-text-muted mb-4">or click to browse from files</p>
                  
                  <div className="flex gap-3">
                    <label className="cursor-pointer" tabIndex={0} onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.currentTarget.querySelector("input")?.click(); 
                      }
                    }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute h-0 w-0 opacity-0" 
                        onChange={handleFileChange} 
                      />
                      <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "font-semibold gap-1.5")}>
                        <FileImage className="h-3.5 w-3.5" /> Choose File
                      </span>
                    </label>
                    <Button variant="secondary" size="sm" className="font-semibold gap-1.5">
                      <Camera className="h-3.5 w-3.5" /> Open Camera
                    </Button>
                  </div>
                </div>
              ) : (
                // Preview Panel & Actions
                <div className="space-y-6">
                  <div className="relative aspect-video max-h-80 w-full overflow-hidden rounded-2xl border border-border bg-slate-100 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={selectedImage} 
                      alt="Uploaded pet preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                    <button 
                      onClick={revokeAndClear}
                      className="absolute top-3 right-3 bg-primary/80 hover:bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={revokeAndClear} disabled={isScanning}>
                      Cancel
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={triggerScan} 
                      disabled={isScanning} 
                      className="font-semibold min-w-32 justify-center"
                    >
                      {isScanning ? "Processing..." : "Analyze Image"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          // Triage Result View (Mock Bottom Sheet / Report)
          <Card className="border-border shadow-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <CardHeader className="bg-primary text-white p-6 pt-8 -mt-6 -mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-state-warning border border-state-warning/20">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Triage Assessment Report</CardTitle>
                    <CardDescription className="text-white/60">Generated just now • ID: #TR-94827</CardDescription>
                  </div>
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wide bg-amber-500/20 text-state-warning border border-state-warning/30 px-3 py-1 rounded-full">
                  Moderate Warning
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6 -mb-6">
              {/* Image Preview Thumbnail */}
              <div className="flex gap-4 p-4 rounded-xl border border-border bg-slate-50/50">
                <div className="h-20 w-28 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-border flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedImage || ""} alt="Scan source" className="object-cover h-full w-full" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-primary">Uploaded Specimen</div>
                  <div className="text-xs text-text-muted">Analyzing: Skin irritation & hair loss near right ear.</div>
                  <div className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400">
                    Confidence: 89%
                  </div>
                </div>
              </div>

              {/* Suggestions bullets */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary">Triage Actionable Suggestions:</h3>
                
                <div className="space-y-3 text-xs leading-relaxed text-text-muted">
                  <div className="flex gap-3 items-start">
                    <span className="h-2 w-2 rounded-full bg-state-warning shrink-0 mt-1.5" />
                    <p>
                      <strong className="text-primary">Monitor irritation closely:</strong> Clean the area gently with warm water. Do not apply human creams or ointments which could worsen irritation.
                    </p>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <span className="h-2 w-2 rounded-full bg-state-warning shrink-0 mt-1.5" />
                    <p>
                      <strong className="text-primary">Prevent scratching:</strong> Use an Elizabethan collar (cone) if necessary to prevent the pet from scratching or licking the area, which can lead to secondary bacterial infections.
                    </p>
                  </div>

                  <div className="flex gap-3 items-start">
                    <span className="h-2 w-2 rounded-full bg-state-success shrink-0 mt-1.5" />
                    <p>
                      <strong className="text-primary">Schedule vet checkup:</strong> While this does not appear to be an acute emergency, we recommend scheduling an appointment within 3-5 days for a proper diagnosis (such as a skin scraping to check for mites or yeast).
                    </p>
                  </div>
                </div>
              </div>

              {/* Legal Disclaimer Box */}
              <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 text-xs text-red-900 leading-relaxed dark:bg-red-950/10 dark:border-red-900/20 dark:text-red-200">
                <div className="flex items-center gap-1.5 font-bold mb-1.5">
                  <HelpCircle className="h-4 w-4 text-destructive" /> Medical Disclaimer
                </div>
                This scan was processed by a machine learning model and does not constitute veterinary diagnostics or professional medical advice. Always consult a licensed veterinarian in person if your pet is showing signs of illness, pain, or distress.
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-border">
                <Button variant="outline" size="sm" onClick={resetScanner}>
                  Scan Another Photo
                </Button>
                <Button size="sm" className="font-semibold gap-1">
                  Find Nearby Vet <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 bg-background p-6 md:p-8 flex items-center justify-center">
        <p className="text-sm text-text-muted">Loading scanner…</p>
      </div>
    }>
      <ScanPageInner />
    </Suspense>
  );
}
