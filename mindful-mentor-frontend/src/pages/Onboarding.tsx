import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-meditation.jpg";

const steps = [
  {
    title: "Welcome to Mindful Mentor",
    description: "Your personal AI companion for mental wellness and mindfulness",
    icon: Heart,
  },
  {
    title: "Track Your Journey",
    description: "Monitor your mood, reflect through journaling, and discover insights about yourself",
    icon: Sparkles,
  },
  {
    title: "Personalized Support",
    description: "Get tailored recommendations and have meaningful conversations with your AI mentor",
    icon: ArrowRight,
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/login");
    }
  };

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Hero Image */}
          <div className="relative">
            <img
              src={heroImage}
              alt="Meditation and wellness"
              className="rounded-3xl shadow-glow animate-float w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-3xl"></div>
          </div>

          {/* Onboarding Content */}
          <div className="space-y-8">
            <Card className="bg-card/90 backdrop-blur-md border-0 shadow-card">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-4 animate-gentle-pulse">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground mb-4">
                    {currentStepData.title}
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center gap-2 mb-8">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-smooth ${
                        index === currentStep
                          ? "bg-primary"
                          : index < currentStep
                          ? "bg-success"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={nextStep}
                  className="w-full bg-gradient-primary text-white border-0 hover:shadow-glow transition-bounce text-lg py-6"
                  size="lg"
                >
                  {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>

            <div className="text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-white/80 hover:text-white transition-smooth underline"
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}