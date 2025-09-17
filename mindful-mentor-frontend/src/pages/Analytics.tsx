import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar,
  Target,
  Award,
  BarChart3,
  Activity,
  Heart,
  BookOpen
} from "lucide-react";

const moodData = [
  { day: 'Mon', mood: 4, date: '12/9' },
  { day: 'Tue', mood: 3, date: '12/10' },
  { day: 'Wed', mood: 5, date: '12/11' },
  { day: 'Thu', mood: 4, date: '12/12' },
  { day: 'Fri', mood: 4, date: '12/13' },
  { day: 'Sat', mood: 5, date: '12/14' },
  { day: 'Sun', mood: 3, date: '12/15' },
];

const achievements = [
  { title: "7-Day Streak", description: "Logged mood for 7 consecutive days", icon: Award, color: "text-success" },
  { title: "Mindful Writer", description: "Created 10 journal entries", icon: BookOpen, color: "text-primary" },
  { title: "Self Aware", description: "Completed first mood analysis", icon: Heart, color: "text-accent-pink" },
  { title: "Consistent Growth", description: "Used the app for 30 days", icon: TrendingUp, color: "text-secondary" },
];

const weeklyStats = [
  { label: "Average Mood", value: "4.1/5", change: "+0.3", trend: "up" },
  { label: "Journal Entries", value: "5", change: "+2", trend: "up" },
  { label: "Meditation Minutes", value: "45", change: "+15", trend: "up" },
  { label: "AI Conversations", value: "8", change: "-1", trend: "down" },
];

const getMoodColor = (mood: number) => {
  if (mood >= 4.5) return "bg-success";
  if (mood >= 3.5) return "bg-primary";
  if (mood >= 2.5) return "bg-warning";
  return "bg-destructive";
};

const getMoodEmoji = (mood: number) => {
  if (mood >= 4.5) return "😊";
  if (mood >= 3.5) return "🙂";
  if (mood >= 2.5) return "😐";
  if (mood >= 1.5) return "🙁";
  return "😞";
};

export default function Analytics() {
  const averageMood = moodData.reduce((sum, day) => sum + day.mood, 0) / moodData.length;

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Your Wellness Journey</h1>
          <p className="text-lg text-muted-foreground">Track your progress and celebrate your growth</p>
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {weeklyStats.map((stat, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm shadow-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <div className={`flex items-center gap-1 text-xs ${
                    stat.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                    {stat.change}
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mood Trend */}
          <Card className="bg-card/80 backdrop-blur-sm shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" />
                Weekly Mood Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average this week</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getMoodEmoji(averageMood)}</span>
                    <Badge className="bg-primary/10 text-primary">
                      {averageMood.toFixed(1)}/5.0
                    </Badge>
                  </div>
                </div>
                
                {/* Mood Chart */}
                <div className="space-y-3">
                  {moodData.map((day, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 text-sm font-medium text-muted-foreground">
                        {day.day}
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-3 relative overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-smooth ${getMoodColor(day.mood)}`}
                          style={{ width: `${(day.mood / 5) * 100}%` }}
                        />
                      </div>
                      <div className="w-8 text-center text-lg">
                        {getMoodEmoji(day.mood)}
                      </div>
                      <div className="w-12 text-xs text-muted-foreground">
                        {day.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Patterns */}
          <Card className="bg-card/80 backdrop-blur-sm shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-secondary" />
                Usage Patterns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Most active time</span>
                  <Badge variant="secondary">Evening</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  You tend to engage most between 7-9 PM
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Preferred activity</span>
                  <Badge variant="secondary">Journaling</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  You've spent 65% of your time journaling
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Consistency score</span>
                  <Badge className="bg-success/10 text-success">85%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  You're very consistent with daily check-ins
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="bg-gradient-warm text-white shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Award className="w-6 h-6" />
              Your Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{achievement.title}</h3>
                      <p className="text-sm text-white/80">{achievement.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="bg-card/80 backdrop-blur-sm shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-accent-pink" />
              Weekly Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-calm rounded-xl">
              <h3 className="font-semibold text-foreground mb-2">Positive Trend 📈</h3>
              <p className="text-sm text-muted-foreground">
                Your mood has been trending upward this week! Your consistent journaling practice 
                seems to be contributing to better emotional awareness.
              </p>
            </div>
            <div className="p-4 bg-accent-pink-light rounded-xl">
              <h3 className="font-semibold text-foreground mb-2">Recommendation 💡</h3>
              <p className="text-sm text-muted-foreground">
                Consider trying our new breathing exercises. Users with similar patterns find them 
                especially helpful for maintaining emotional balance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}