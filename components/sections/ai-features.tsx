"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Bot, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AiFeatures() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <Sparkles className="h-10 w-10 text-blue-500" />,
      title: "AI-Powered Recommendations",
      description: "Our intelligent system learns your preferences and provides personalized product suggestions tailored just for you."
    },
    {
      icon: <Bot className="h-10 w-10 text-purple-500" />,
      title: "Intelligent Chatbot Assistant",
      description: "Get instant help with product information, order status, and more through our advanced AI chatbot."
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-teal-500" />,
      title: "Smart Trend Analysis",
      description: "Stay ahead with our AI that analyzes shopping trends and suggests products that match your style."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Smarter Shopping Experience</h2>
          <p className="text-muted-foreground">
            Our cutting-edge AI technology enhances your shopping experience by providing personalized recommendations and intelligent assistance.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6 flex flex-col items-center text-center p-6">
                  <div className="mb-5 p-3 rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}