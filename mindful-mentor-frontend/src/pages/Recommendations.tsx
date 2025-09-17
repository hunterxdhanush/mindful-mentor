import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Play, 
  BookOpen, 
  Heart,
  Clock,
  Headphones,
  Quote,
  Zap,
  Target
} from "lucide-react";
import wellnessImage from "@/assets/wellness-icons.jpg";

const categories = [
  { id: 'meditation', label: 'Meditation', icon: Heart, color: 'bg-primary/10 text-primary' },
  { id: 'breathing', label: 'Breathing', icon: Zap, color: 'bg-secondary/10 text-secondary' },
  { id: 'mindfulness', label: 'Mindfulness', icon: Target, color: 'bg-accent/10 text-accent-pink' },
  { id: 'quotes', label: 'Inspiration', icon: Quote, color: 'bg-success/10 text-success' },
];

const recommendations = [
  {
    id: 1,
    title: "5-Minute Breathing Exercise",
    description: "A gentle breathing practice to center yourself and reduce anxiety",
    category: "breathing",
    duration: "5 min",
    type: "exercise",
    difficulty: "Beginner",
  },
  {
    id: 2,
    title: "Guided Body Scan Meditation",
    description: "Progressive relaxation to release tension and promote deep rest",
    category: "meditation",
    duration: "15 min",
    type: "meditation",
    difficulty: "Intermediate",
  },
  {
    id: 3,
    title: "Mindful Walking Practice",
    description: "Transform your daily walk into a mindfulness practice",
    category: "mindfulness",
    duration: "10 min",
    type: "exercise",
    difficulty: "Beginner",
  },
  {
    id: 4,
    title: "Daily Affirmations for Students",
    description: "Positive affirmations to build confidence and resilience",
    category: "quotes",
    duration: "3 min",
    type: "reading",
    difficulty: "Beginner",
  },
  {
    id: 5,
    title: "Stress Release Meditation",
    description: "Let go of the day's stress with this calming guided practice",
    category: "meditation",
    duration: "12 min",
    type: "meditation",
    difficulty: "Beginner",
  },
  {
    id: 6,
    title: "Gratitude Reflection Exercise",
    description: "Cultivate appreciation and positive mindset through gratitude",
    category: "mindfulness",
    duration: "8 min",
    type: "exercise",
    difficulty: "Beginner",
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'meditation':
      return Headphones;
    case 'reading':
      return BookOpen;
    default:
      return Play;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-success/10 text-success border-success/20';
    case 'Intermediate':
      return 'bg-warning/10 text-warning border-warning/20';
    default:
      return 'bg-muted';
  }
};

export default function Recommendations() {
  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Personalized Recommendations</h1>
          <p className="text-lg text-muted-foreground">Curated wellness content just for you</p>
        </div>

        {/* Hero Card */}
        <Card className="bg-gradient-hero text-white shadow-glow border-0 overflow-hidden">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Your Wellness Journey</h2>
                <p className="text-white/90 text-lg leading-relaxed mb-6">
                  Based on your recent mood and journal entries, we've curated these personalized 
                  recommendations to support your mental wellness.
                </p>
                <div className="flex gap-3">
                  <Badge className="bg-white/20 text-white border-white/30">
                    Personalized for you
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    Updated daily
                  </Badge>
                </div>
              </div>
              <div className="relative">
                <img
                  src={wellnessImage}
                  alt="Wellness and mindfulness"
                  className="rounded-2xl shadow-glow animate-float"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant="outline"
                className={`${category.color} border-current hover:shadow-soft transition-bounce`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <Card key={item.id} className="bg-card/80 backdrop-blur-sm shadow-card border-0 hover:shadow-glow transition-bounce group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <TypeIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <Badge className={getDifficultyColor(item.difficulty)}>
                          {item.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {item.duration}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-smooth">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {item.description}
                  </p>
                  
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-gradient-primary text-white hover:shadow-glow transition-bounce">
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                    <Button variant="outline" size="icon" className="hover:shadow-soft">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Daily Quote */}
        <Card className="bg-gradient-warm text-white shadow-card border-0">
          <CardContent className="p-8 text-center">
            <Quote className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <blockquote className="text-2xl font-medium mb-4 leading-relaxed">
              "The present moment is the only time over which we have dominion."
            </blockquote>
            <p className="text-white/80">— Thích Nhất Hạnh</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}