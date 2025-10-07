"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ChatMessage {
  text: string;
  isUser: boolean;
}

interface AIContextType {
  personalizedRecommendations: string[];
  chatMessages: ChatMessage[];
  sendMessage: (message: string) => void;
  isProcessing: boolean;
}

const AIContext = createContext<AIContextType>({
  personalizedRecommendations: [],
  chatMessages: [],
  sendMessage: () => {},
  isProcessing: false,
});

export const useAI = () => useContext(AIContext);

export const AIProvider = ({ children }: { children: React.ReactNode }) => {
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewedProducts, setViewedProducts] = useState<string[]>([]);
  const [userPreferences, setUserPreferences] = useState({
    categories: [] as string[],
    priceRange: { min: 0, max: 1000 },
    brands: [] as string[],
  });

  // Simulate loading user preferences and generating recommendations
  useEffect(() => {
    // In a real app, this would come from user browsing history and API calls
    const sampleProductIds = [
      "prod-1", "prod-2", "prod-3", "prod-4", 
      "prod-5", "prod-6", "prod-7", "prod-8"
    ];
    
    // Simulate random recommendations based on "AI"
    const randomRecommendations = [];
    const numberOfRecommendations = Math.floor(Math.random() * 3) + 2; // 2-4 recommendations
    
    while (randomRecommendations.length < numberOfRecommendations) {
      const randomId = sampleProductIds[Math.floor(Math.random() * sampleProductIds.length)];
      if (!randomRecommendations.includes(randomId)) {
        randomRecommendations.push(randomId);
      }
    }
    
    setPersonalizedRecommendations(randomRecommendations);
  }, []);

  const processUserMessage = async (message: string): Promise<string> => {
    // In a real app, this would call an AI service or API
    setIsProcessing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowercasedMessage = message.toLowerCase();
    
    // Simple pattern matching for demo purposes
    if (lowercasedMessage.includes("hello") || lowercasedMessage.includes("hi")) {
      return "Hello! How can I help you with your shopping today?";
    } else if (lowercasedMessage.includes("recommend") || lowercasedMessage.includes("suggestion")) {
      return "Based on your browsing history, I recommend checking out our new summer collection and electronics deals. Would you like me to show you specific items?";
    } else if (lowercasedMessage.includes("order") && (lowercasedMessage.includes("track") || lowercasedMessage.includes("status"))) {
      return "To track your order, please provide your order number. Alternatively, you can view all your orders in the Account section.";
    } else if (lowercasedMessage.includes("return") || lowercasedMessage.includes("refund")) {
      return "Our return policy allows for returns within 30 days of purchase. Would you like me to guide you through the return process?";
    } else if (lowercasedMessage.includes("help") || lowercasedMessage.includes("support")) {
      return "I'm here to help! You can ask me about products, place orders, track shipments, or get assistance with returns. What do you need help with?";
    } else if (lowercasedMessage.includes("new") && lowercasedMessage.includes("stock")) {
      return "We've just added new items to our summer collection! We also have the latest tech gadgets in our electronics section. Would you like to see them?";
    } else if (lowercasedMessage.includes("gift")) {
      return "Looking for a gift? I can help! What's the occasion and do you have a budget in mind? I can suggest items based on the recipient's interests.";
    } else if (lowercasedMessage.includes("discount") || lowercasedMessage.includes("coupon") || lowercasedMessage.includes("promo")) {
      return "We currently have a summer sale with up to 40% off select items. You can also use the code WELCOME10 for 10% off your first purchase!";
    } else {
      return "I understand you're asking about " + message.split(" ").slice(0, 3).join(" ") + "... Can you provide more details so I can better assist you?";
    }
  };

  const sendMessage = async (message: string) => {
    // Add user message to chat
    setChatMessages((prev) => [...prev, { text: message, isUser: true }]);
    setIsProcessing(true);
    
    try {
      // Process the message and get AI response
      const response = await processUserMessage(message);
      
      // Add AI response to chat
      setChatMessages((prev) => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      console.error("Error processing message:", error);
      setChatMessages((prev) => [
        ...prev, 
        { text: "Sorry, I encountered an error. Please try again later.", isUser: false }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Track viewed products and update recommendations
  const trackProductView = (productId: string) => {
    if (!viewedProducts.includes(productId)) {
      const updated = [...viewedProducts, productId];
      setViewedProducts(updated);
      
      // In a real app, this would trigger an API call to update recommendations
      // For the demo, we'll just randomly update recommendations occasionally
      if (updated.length % 3 === 0) {
        updateRecommendations();
      }
    }
  };

  const updateRecommendations = () => {
    // Simulate updating recommendations based on user behavior
    // In a real app, this would call an AI model or recommendation engine
    const sampleProductIds = [
      "prod-1", "prod-2", "prod-3", "prod-4", 
      "prod-5", "prod-6", "prod-7", "prod-8",
      "prod-9", "prod-10", "prod-11", "prod-12"
    ];
    
    const numberOfRecommendations = Math.floor(Math.random() * 3) + 2; // 2-4 recommendations
    const newRecommendations = [];
    
    while (newRecommendations.length < numberOfRecommendations) {
      const randomId = sampleProductIds[Math.floor(Math.random() * sampleProductIds.length)];
      if (!newRecommendations.includes(randomId)) {
        newRecommendations.push(randomId);
      }
    }
    
    setPersonalizedRecommendations(newRecommendations);
  };

  return (
    <AIContext.Provider
      value={{
        personalizedRecommendations,
        chatMessages,
        sendMessage,
        isProcessing
      }}
    >
      {children}
    </AIContext.Provider>
  );
};