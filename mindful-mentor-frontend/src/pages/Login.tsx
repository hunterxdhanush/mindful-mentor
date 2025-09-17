import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Mail, Lock, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate authentication
    toast({
      title: isSignUp ? "Welcome!" : "Welcome back!",
      description: isSignUp ? "Your account has been created" : "Successfully signed in",
    });

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-smooth mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to welcome
          </button>
        </div>

        <Card className="bg-card/90 backdrop-blur-md border-0 shadow-card">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <p className="text-muted-foreground">
              {isSignUp 
                ? "Start your mindfulness journey today" 
                : "Continue your wellness journey"
              }
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-border"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary text-white border-0 hover:shadow-glow transition-bounce"
                size="lg"
              >
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:text-primary-dark transition-smooth underline"
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Need an account? Sign up"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}