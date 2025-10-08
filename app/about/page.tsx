import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">About SmartShop</h1>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Our Story</h2>
            <p className="text-muted-foreground">
              Founded in 2023, SmartShop started with a simple idea: to create an exceptional online shopping experience. 
              We believe in quality, affordability, and most importantly, customer satisfaction.
            </p>
            <p className="text-muted-foreground">
              Our team is dedicated to bringing you the latest products at the best prices, with fast shipping and 
              excellent customer service.
            </p>
            <Button asChild>
              <Link href="/shop" className="mt-4">
                Shop Now
              </Link>
            </Button>
          </div>
          {/* <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src=""
              alt="Our Store"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div> */}
        </div>

        <div className="bg-muted/50 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Quality Products",
                description: "We source only the best products from trusted suppliers.",
                icon: "🛍️"
              },
              {
                title: "Fast Shipping",
                description: "Quick delivery to your doorstep, usually within 2-3 business days.",
                icon: "🚚"
              },
              {
                title: "24/7 Support",
                description: "Our customer service team is always here to help you.",
                icon: "💬"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-background p-6 rounded-lg text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Have Questions?</h2>
          <p className="text-muted-foreground mb-6">We'd love to hear from you!</p>
          <Button asChild variant="outline">
            <Link href="/contact">
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
