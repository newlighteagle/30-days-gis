import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, CheckCircle2, MapPin, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getChallenges() {
  try {
    const challenges = await prisma.challenge.findMany({
      orderBy: { day: 'asc' },
    });
    return challenges;
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
}

export default async function Dashboard() {
  const challenges = await getChallenges();
  const completedCount = challenges.filter((c) => c.completed).length;
  const totalCount = challenges.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const nextChallenge = challenges.find((c) => !c.completed);
  const recentCompleted = challenges.filter((c) => c.completed).slice(-5);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{percentage}%</div>
            <p className="text-xs text-muted-foreground">
              {completedCount} of {totalCount} challenges
            </p>
            <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              Challenges finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount - completedCount}</div>
            <p className="text-xs text-muted-foreground">
              Challenges to go
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((completedCount / totalCount) * 100)}%</div>
            <p className="text-xs text-muted-foreground">
              On track to finish
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Next Challenge */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Up Next</CardTitle>
            <CardDescription>
              Your next mapping challenge awaits
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nextChallenge ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Day {nextChallenge.day}
                    </p>
                    <h3 className="text-2xl font-bold">{nextChallenge.title}</h3>
                    {nextChallenge.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {nextChallenge.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline">{nextChallenge.type}</Badge>
                </div>
                <Button asChild>
                  <Link href={`/challenge/${nextChallenge.day}`}>
                    Start Challenge
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold">All Challenges Completed!</h3>
                <p className="text-sm text-muted-foreground">Congratulations on finishing all 30 days!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Completions</CardTitle>
            <CardDescription>
              Your latest finished challenges
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentCompleted.length > 0 ? (
              <div className="space-y-4">
                {recentCompleted.map((challenge) => (
                  <Link
                    key={challenge.id}
                    href={`/challenge/${challenge.day}`}
                    className="flex items-center gap-4 rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Day {challenge.day}: {challenge.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {challenge.type}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No completed challenges yet. Start your first challenge!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Challenges */}
      <Card>
        <CardHeader>
          <CardTitle>All Challenges</CardTitle>
          <CardDescription>
            Browse and track all 30 mapping challenges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {challenges.map((challenge) => (
              <Link
                key={challenge.id}
                href={`/challenge/${challenge.day}`}
                className="group relative overflow-hidden rounded-lg border p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Day {challenge.day}
                    </p>
                    <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                      {challenge.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {challenge.type}
                    </Badge>
                  </div>
                  {challenge.completed && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
