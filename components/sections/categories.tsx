import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Categories() {
  const categories = [
    {
      name: "Electronics",
      image: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=1200",
      link: "/categories/electronics"
    },
    {
      name: "Fashion",
      image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1200",
      link: "/categories/fashion"
    },
    {
      name: "Home & Kitchen",
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
      link: "/categories/home-kitchen"
    },
    {
      name: "Beauty",
      image: "https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=1200",
      link: "/categories/beauty"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground mt-2">
              Browse our wide range of product categories
            </p>
          </div>
          <Link href="/categories">
            <Button variant="ghost" className="group">
              All Categories <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              href={category.link}
              className="group block relative h-[300px] rounded-lg overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6">
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                <span className={cn(
                  "inline-flex items-center text-sm text-white/80 mt-2",
                  "transition-all duration-300 group-hover:translate-x-1"
                )}>
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}