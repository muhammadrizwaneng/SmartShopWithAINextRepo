"use client";

import { useState, useEffect } from "react";
// We need to use Link from 'next/link'
import Link from "next/link";
// We need usePathname from 'next/navigation' for checking the current route
import { usePathname } from "next/navigation"; 
import { ShoppingCart, Heart, User, Search, Menu, X, Package, Sun, Moon, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { useCart } from "@/contexts/cart-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { cartItemsCount } = useCart();
  const [mounted, setMounted] = useState(false);
  // --- New: Get the current path ---
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  
  // Helper to check if a link is active (for desktop nav)
  const isActive = (href) => {
    // Basic check for exact match
    return pathname === href;
  }
  
  // Specific check for Sign In route
  const isSignInActive = isActive('/signin');
  // Specific check for Sign Up route (optional, but good practice)
  const isSignUpActive = isActive('/signup');


  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            <span className="font-bold text-xl">SmartShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.href) ? "text-primary" : "text-foreground/70" // highlight active page
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Link href="/search">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* User Account Icon */}
            <Link href="/account">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            
            {/* Desktop Sign In & Sign Up Buttons */}
            <Link href="/signin" className="hidden lg:flex">
              <Button 
                size="sm"
                // --- Conditional styling for active state ---
                variant={isSignInActive ? "default" : "outline"} 
              >
                Sign In
              </Button>
            </Link>

            <Link href="/signup" className="hidden lg:flex">
              <Button 
                size="sm"
                // --- Conditional styling for active state ---
                variant={isSignUpActive ? "default" : "outline"} // Optional: make Sign Up active too
              >
                Sign Up
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        isActive(item.href) ? "text-primary" : "text-foreground"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* Mobile Sign In Button with active state */}
                  <Link href="/signin">
                    <Button 
                      size="lg" 
                      className="mt-2 w-full justify-start"
                      // --- Conditional styling for active state ---
                      variant={isSignInActive ? "default" : "outline"}
                    >
                      <LogIn className="mr-2 h-5 w-5" /> Sign In
                    </Button>
                  </Link>
                  
                  {/* Mobile Sign Up Button with active state */}
                  <Link href="/signup">
                    <Button 
                      size="lg" 
                      className="w-full justify-start"
                      // --- Conditional styling for active state ---
                      variant={isSignUpActive ? "default" : "outline"}
                    >
                      <UserPlus className="mr-2 h-5 w-5" /> Sign Up
                    </Button>
                  </Link>

                  <Button variant="outline" size="lg" onClick={toggleTheme} className="mt-4 w-full justify-start">
                    {theme === "dark" ? (
                      <><Sun className="mr-2 h-5 w-5" /> Light Mode</>
                    ) : (
                      <><Moon className="mr-2 h-5 w-5" /> Dark Mode</>
                    )}
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;