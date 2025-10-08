'use client';

import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, Phone, MapPin, ShoppingBag, LogOut } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const user = useAppSelector((state) => state.auth?.user);
  const { cartItemsCount, wishlistItemsCount } = useAppSelector((state) => ({
    cartItemsCount: state.cart?.items?.length || 0,
    wishlistItemsCount: state.wishlist?.items?.length || 0
  }));

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Please sign in to view your account</h2>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register">Create Account</Link>
          </Button>
        </div>
      </div>
    );
  }

  const userInitials = user.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
              {user.role === 'admin' && (
                <Badge variant="outline" className="mt-2">
                  Admin
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.phone}</span>
                </div>
              )}
              {user.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{user.address}</span>
                </div>
              )}
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{cartItemsCount}</p>
                  <p className="text-sm text-muted-foreground">In Cart</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{wishlistItemsCount}</p>
                  <p className="text-sm text-muted-foreground">Wishlist</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/account/orders">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  View Orders
                </Link>
              </Button>
              <Button variant="outline" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Account Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                )}
                {user.address && (
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{user.address}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <Button variant="outline" asChild>
                  <Link href="/account/edit">Edit Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order History (Placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>You haven't placed any orders yet.</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/admin/products">Start Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
