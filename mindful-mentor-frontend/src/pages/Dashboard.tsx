import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  BookOpen, 
  MessageCircle, 
  TrendingUp, 
  Lightbulb,
  Calendar,
  Smile,
  Meh,
  Frown
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const moodOptions = [
  { emoji: "😊", label: "Great", value: 5, color: "bg-success" },
  { emoji: "🙂", label: "Good", value: 4, color: "bg-primary" },
  { emoji: "😐", label: "Okay", value: 3, color: "bg-warning" },
  { emoji: "🙁", label: "Not great", value: 2, color: "bg-accent" },
  { emoji: "😞", label: "Difficult", value: 1, color: "bg-destructive" },
];

const recentEntries = [
  { date: "Today", preview: "Feeling grateful for the small moments of peace in my day..." },
  { date: "Yesterday", preview: "Had an interesting conversation about mindfulness with a friend..." },
  { date: "2 days ago", preview: "Practiced meditation for 10 minutes this morning. Noticing..." },
];

const dailyTips = [
  "Take three deep breaths before starting any task to center yourself.",
  "Practice gratitude by writing down three things you're thankful for today.",
  "Notice the sensation of your feet touching the ground when you walk.",
  "Set a gentle reminder to check in with your emotions every few hours.",
];

export default function Dashboard() {
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [tipIndex] = useState(() => Math.floor(Math.random() * dailyTips.length));

  const handleMoodSelect = (value: number) => {
    setCurrentMood(value);
    toast({
      title: "Mood recorded",
      description: "Thank you for checking in with yourself today.",
    });
  };

  const todaysTip = dailyTips[tipIndex];

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Good day! 🌸</h1>
          <p className="text-lg text-muted-foreground">How are you feeling right now?</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mood Check-in */}
          <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Heart className="w-6 h-6 text-primary" />
                Daily Mood Check-in
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => handleMoodSelect(mood.value)}
                    className={`p-4 rounded-2xl border transition-bounce hover:scale-105 ${
                      currentMood === mood.value
                        ? "border-primary bg-primary/10 shadow-soft"
                        : "border-border hover:border-primary/50 bg-background/50"
                    }`}
                  >
                    <div className="text-3xl mb-2">{mood.emoji}</div>
                    <div className="text-sm font-medium">{mood.label}</div>
                  </button>
                ))}
              </div>
              {currentMood && (
                <div className="mt-4 p-4 bg-gradient-calm rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    Thank you for checking in. Your awareness is the first step to wellness.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Tip */}
          <Card className="bg-gradient-warm text-white shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Lightbulb className="w-6 h-6" />
                Daily Mindfulness Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 leading-relaxed">{todaysTip}</p>
              <div className="mt-4 flex items-center gap-2 text-white/70 text-sm">
                <Calendar className="w-4 h-4" />
                Today's wisdom
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Journal Entries */}
          <Card className="bg-card/80 backdrop-blur-sm shadow-card border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" />
                Recent Reflections
              </CardTitle>
              <Button variant="outline" size="sm" className="hover:shadow-soft">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentEntries.map((entry, index) => (
                <div key={index} className="p-4 rounded-xl bg-background/50 hover:bg-background/70 transition-smooth cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {entry.date}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {entry.preview}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card/80 backdrop-blur-sm shadow-card border-0">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button 
                className="h-20 flex flex-col gap-2 bg-gradient-primary text-white hover:shadow-glow transition-bounce"
                onClick={() => window.location.href = '/journal'}
              >
                <BookOpen className="w-6 h-6" />
                <span className="text-sm">Write Entry</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:shadow-soft transition-bounce"
                onClick={() => window.location.href = '/chat'}
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-sm">Chat with AI</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:shadow-soft transition-bounce"
                onClick={() => window.location.href = '/recommendations'}
              >
                <Lightbulb className="w-6 h-6" />
                <span className="text-sm">Get Tips</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 hover:shadow-soft transition-bounce"
                onClick={() => window.location.href = '/analytics'}
              >
                <TrendingUp className="w-6 h-6" />
                <span className="text-sm">View Progress</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}