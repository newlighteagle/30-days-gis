import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button>Download Report</Button>
        </div>
      </div>

      {/* Konten dashboard */}
      <div className="grid grid-cols-3 gap-6">
        {/* isi cards, charts, dsb */}
      </div>
    </div>
  );
}
