import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
      <div className="flex items-center gap-3">
        <PawPrint className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          PAWPower
        </h1>
      </div>
      
      <div className="flex gap-4">
        <Button size="lg">Get Started</Button>
        <Button variant="outline" size="lg">Learn More</Button>
      </div>
    </div>
  );
}

