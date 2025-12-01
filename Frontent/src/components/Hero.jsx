import { ArrowRight, Zap } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge"; // Fixed Badge import
import { getData} from "@/context/userContext";

const Hero = () => {
  const {user} = getData()
  const navigate = useNavigate();

  return (
    <div className="relative w-full md:h-[700px] h-screen bg-green-50 overflow-hidden">
      <div className="w-full py-12 md:py-24 lg:py-32 xl:py-44">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="font-bold text-2xl capitalize">Welcome {user?.userName}</h1>
            <div className="space-y-2">
              <Badge className="mb-4 text-green-800 border border-green-300 bg-green-100">
                <Zap className="h-4 w-4 mr-1" />
                New: AI-powered notes organization!
              </Badge>

              <h1 className="text-green-600 text-3xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
                Your thoughts, organized with AI for{" "}
                <span className="text-gray-800">Everyone</span>
              </h1>

              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Capture ideas, organize thoughts, and collaborate seamlessly.
                The modern note-taking app that grows with you and keeps your ideas secure in the cloud.
              </p>
            </div>

            <div className="space-x-4">
              <Button
                onClick={() => navigate("/create-todo")}
                size="lg"
                className="h-12 px-8 bg-green-600 text-sm"
              >
                Start taking notes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-sm text-green-700 bg-white border-green-300"
              >
                Watch Demo
              </Button>

              <p className="pt-2 text-sm text-gray-600">
                Free forever • No credit card required • 2-minute setup
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
