"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Map, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Challenge {
  id: number;
  day: number;
  title: string;
  completed: boolean;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/challenges")
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching challenges:", error);
        setLoading(false);
      });
  }, []);

  const completedCount = challenges.filter((c) => c.completed).length;
  const percentage =
    challenges.length > 0
      ? Math.round((completedCount / challenges.length) * 100)
      : 0;

  return (
    <aside className="w-80 border-r bg-background">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Map className="h-6 w-6" />
            <span className="">30 Days Challenge</span>
          </Link>
        </div>

        {/* Progress */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Progress</p>
            <Badge variant="secondary">{percentage}%</Badge>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {completedCount} of {challenges.length} completed
          </p>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-hidden">
          <nav className="grid gap-1 p-2">
            <Link href="/">
              <Button
                variant={pathname === "/" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </nav>

          <div className="px-4 py-2">
            <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
              Challenges
            </h2>
          </div>

          <ScrollArea className="h-[calc(100vh-280px)] px-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <div className="space-y-1">
                {challenges.map((challenge) => {
                  const isActive = pathname === `/challenge/${challenge.day}`;
                  return (
                    <Link
                      key={challenge.id}
                      href={`/challenge/${challenge.day}`}
                    >
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start font-normal",
                          isActive && "bg-muted font-medium"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground font-medium">
                              {String(challenge.day).padStart(2, "0")}
                            </span>
                            <span className="text-sm truncate">
                              {challenge.title}
                            </span>
                          </div>
                          {challenge.completed && (
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          )}
                        </div>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </aside>
  );
}
