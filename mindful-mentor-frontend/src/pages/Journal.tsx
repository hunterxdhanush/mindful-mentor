import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Send, 
  Sparkles, 
  Clock,
  Calendar,
  Heart,
  Brain
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { createJournal, listJournals, type Journal as JournalModel } from "@/lib/api";

const prompts = [
  "What am I grateful for today?",
  "How am I feeling right now?",
  "What challenged me today and how did I handle it?",
  "What brought me joy or peace today?",
  "What would I like to focus on tomorrow?",
];

const aiInsights = [
  "I notice you've been reflecting a lot on gratitude lately. This is a powerful practice for building resilience.",
  "Your entries show growth in self-awareness. You're becoming more mindful of your emotional patterns.",
  "The way you process challenges has evolved. You're developing healthy coping strategies.",
  "Your writing reveals a strengthening connection to your values and what matters most to you.",
];

export default function Journal() {
  const [entry, setEntry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [journals, setJournals] = useState<JournalModel[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Ensure we have a demo user and load recent journals
  useEffect(() => {
    const init = async () => {
      try {
        // Always upsert a demo user to avoid stale localStorage IDs causing FK errors
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'demo@local',
            display_name: 'Demo User',
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const uid = data.id as string;
        localStorage.setItem("mm_user_id", uid);
        setUserId(uid);
        setLoadingList(true);
        const listed = await listJournals(uid);
        setJournals(listed.items);
      } catch (e: any) {
        toast({ title: 'Setup error', description: e.message || 'Failed to init user', variant: 'destructive' });
      } finally {
        setLoadingList(false);
      }
    };
    init();
  }, []);

  const handleSubmit = async () => {
    if (!entry.trim()) {
      toast({
        title: "Empty entry",
        description: "Please write something before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!userId) throw new Error('User not ready');
      const created = await createJournal({
        userId,
        title: new Date().toLocaleDateString(),
        content: entry.trim(),
      });
      setEntry("");
      setShowInsight(true);
      // Prepend to list
      setJournals((prev) => [created, ...prev].slice(0, 50));
      toast({ title: 'Entry saved', description: 'Your reflection has been recorded.' });
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message || 'Please try again', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  const randomInsight = aiInsights[Math.floor(Math.random() * aiInsights.length)];

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Journal & Reflect</h1>
          <p className="text-lg text-muted-foreground">A safe space for your thoughts and feelings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Journal Interface */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Today's Entry
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="What's on your mind today? Share your thoughts, feelings, or experiences..."
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  className="min-h-[300px] bg-background/50 border-border resize-none text-lg leading-relaxed"
                />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {entry.length} characters
                  </div>
                  
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-primary text-white hover:shadow-glow transition-bounce"
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Get AI Insights
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Insight */}
            {showInsight && (
              <Card className="bg-gradient-warm text-white shadow-card border-0 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Brain className="w-6 h-6" />
                    AI Insight
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90 leading-relaxed">{randomInsight}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Writing Prompt */}
            <Card className="bg-card/80 backdrop-blur-sm shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-accent-pink" />
                  Writing Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {randomPrompt}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEntry(entry + (entry ? "\n\n" : "") + randomPrompt + "\n")}
                  className="w-full hover:shadow-soft"
                >
                  Use this prompt
                </Button>
              </CardContent>
            </Card>

            {/* Recent Stats */}
            <Card className="bg-card/80 backdrop-blur-sm shadow-card border-0">
              <CardHeader>
                <CardTitle className="text-lg">Your Journals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loadingList && <div className="text-sm text-muted-foreground">Loading...</div>}
                {!loadingList && journals.length === 0 && (
                  <div className="text-sm text-muted-foreground">No entries yet. Create your first reflection!</div>
                )}
                {!loadingList && journals.map(j => (
                  <div key={j.id} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground truncate max-w-[70%]" title={j.title ?? j.content}>
                      {(j.title ?? j.content).slice(0, 40)}{(j.title ?? j.content).length > 40 ? '…' : ''}
                    </span>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {new Date(j.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}