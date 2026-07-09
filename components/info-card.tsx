import { type LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  content: string;
}

export function InfoCard({ icon: Icon, title, description, content }: InfoCardProps) {
  return (
    <Card className="border-border hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-3">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle className="text-lg font-bold text-primary">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="text-xs text-text-muted leading-relaxed">
        {content}
      </CardContent>
    </Card>
  );
}
