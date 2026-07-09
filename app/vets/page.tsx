import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Clock, Search, Map, Star, Award, Navigation } from "lucide-react";

export default function VetFinderPage() {
  const vets = [
    {
      name: "Green Valley Veterinary Hospital",
      distance: "0.8 miles",
      rating: 4.9,
      reviews: 124,
      address: "128 Oakridge Dr, San Francisco, CA 94107",
      phone: "(415) 555-0192",
      hours: "Open 24/7 (Emergency Service)",
      specialties: ["Emergency Care", "Surgery", "Canine Medicine"],
      recommended: true,
    },
    {
      name: "Feline & Friends Pet Clinic",
      distance: "1.5 miles",
      rating: 4.8,
      reviews: 89,
      address: "492 Valencia St, San Francisco, CA 94103",
      phone: "(415) 555-0245",
      hours: "8:00 AM - 6:00 PM",
      specialties: ["Feline Medicine", "Dentistry", "Immunizations"],
      recommended: false,
    },
    {
      name: "North Heights Animal Hospital",
      distance: "2.3 miles",
      rating: 4.7,
      reviews: 215,
      address: "712 Broadway Ave, San Francisco, CA 94133",
      phone: "(415) 555-0311",
      hours: "9:00 AM - 7:00 PM",
      specialties: ["Avian & Exotic", "Geriatric Care", "Diagnostics"],
      recommended: false,
    },
  ];

  return (
    <div className="flex-1 bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">Vet Finder</h1>
            <p className="text-sm text-text-muted">Locate and route to nearby veterinary clinics and 24/7 emergency centers.</p>
          </div>
          <Button variant="secondary" className="font-semibold gap-2 self-start sm:self-auto">
            <Award className="h-4 w-4" /> Register as a Vet
          </Button>
        </div>

        {/* Search Panel */}
        <div className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input 
              placeholder="Search by clinic name, specialty or city..." 
              className="pl-10 h-10 border-border bg-background focus-visible:ring-secondary/50 focus-visible:border-secondary" 
            />
          </div>
          <div className="flex gap-3">
            <Input 
              placeholder="Your Location (e.g. San Francisco)" 
              defaultValue="San Francisco, CA"
              className="w-full md:w-64 h-10 border-border bg-background focus-visible:ring-secondary/50 focus-visible:border-secondary" 
            />
            <Button className="h-10 px-5 font-semibold">Search</Button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Vets list */}
          <div className="lg:col-span-2 space-y-6">
            {vets.map((vet, idx) => (
              <Card key={idx} className={`border-border shadow-sm transition-all duration-200 hover:shadow-md ${
                vet.recommended ? "border-l-4 border-l-secondary" : ""
              }`}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-primary">{vet.name}</h2>
                        {vet.recommended && (
                          <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-secondary border border-secondary/25 px-2 py-0.5 rounded-full">
                            Emergency Clinic
                          </span>
                        )}
                      </div>
                      
                      {/* Ratings and distance */}
                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                          <span className="font-semibold text-primary">{vet.rating}</span>
                          <span>({vet.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{vet.distance} away</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-1.5 pt-2 text-xs text-text-muted">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span>{vet.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span>{vet.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          <span className={vet.hours.includes("24/7") ? "text-red-600 font-medium" : ""}>
                            {vet.hours}
                          </span>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1.5 pt-3">
                        {vet.specialties.map((spec, sIdx) => (
                          <span key={sIdx} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-1 rounded border border-border">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0 justify-end self-end sm:self-start w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="font-semibold gap-1.5 w-full justify-center">
                        <Phone className="h-3.5 w-3.5" /> Call Clinic
                      </Button>
                      <Button size="sm" className="font-semibold gap-1.5 w-full justify-center bg-primary hover:bg-primary/80">
                        <Navigation className="h-3.5 w-3.5" /> Route
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map Placeholder */}
          <Card className="border-border shadow-sm overflow-hidden h-[400px] lg:h-auto flex flex-col">
            <CardHeader className="bg-primary text-white pb-3 pt-3 -mx-0 -mt-4 -mb-4">
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5 text-secondary" />
                <CardTitle className="text-lg font-bold">Interactive Map</CardTitle>
              </div>
              <CardDescription className="text-white/60">Locations of nearby providers</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 bg-slate-100 flex items-center justify-center relative -mb-4">
              {/* Mock map style */}
              <div className="absolute inset-0 bg-cover bg-center opacity-70 filter saturate-50" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000')" }} />
              <div className="absolute inset-0 bg-primary/5" />
              <div className="relative z-10 text-center p-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md text-primary mb-3">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="text-sm font-semibold text-primary">PostGIS Geolocation Active</div>
                <div className="text-xs text-text-muted mt-1 max-w-[200px] mx-auto">Showing 3 clinics within a 5-mile radius of San Francisco</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
