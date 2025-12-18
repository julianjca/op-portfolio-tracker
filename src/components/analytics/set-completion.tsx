'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SetCompletionData {
  setCode: string;
  setName: string;
  ownedCards: number;
  totalCards: number;
  completionPercentage: number;
}

interface SetCompletionProps {
  sets: SetCompletionData[];
}

export function SetCompletion({ sets }: SetCompletionProps) {
  if (sets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Set Completion</CardTitle>
          <CardDescription>Track your progress toward completing sets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-8 text-center">
            Add cards to your portfolio to see set completion progress.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Completion</CardTitle>
        <CardDescription>Track your progress toward completing sets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sets.map((set) => (
          <div key={set.setCode} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {set.setCode} - {set.setName}
              </span>
              <span className="text-muted-foreground">
                {set.ownedCards}/{set.totalCards} ({set.completionPercentage.toFixed(1)}%)
              </span>
            </div>
            <div className="bg-secondary h-2 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${Math.min(set.completionPercentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
