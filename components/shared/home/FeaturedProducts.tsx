"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Classic White Shirt",
      price: 49.99,
      originalPrice: 69.99,
      image: "👕",
      category: "Shirts",
      isNew: true,
    },
    {
      id: 2,
      name: "Denim Jacket",
      price: 89.99,
      originalPrice: null,
      image: "🧥",
      category: "Jackets",
      isNew: false,
    },
    {
      id: 3,
      name: "Summer Dress",
      price: 79.99,
      originalPrice: 99.99,
      image: "👗",
      category: "Dresses",
      isNew: true,
    },
    {
      id: 4,
      name: "Casual Sneakers",
      price: 119.99,
      originalPrice: null,
      image: "👟",
      category: "Shoes",
      isNew: false,
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of trending fashion items
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-square bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-6xl">
                    {product.image}
                  </div>
                  {product.isNew && <Badge className="absolute top-2 left-2 bg-primary">New</Badge>}
                  {product.originalPrice && (
                    <Badge className="absolute top-2 right-2 bg-destructive">Sale</Badge>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon icon="mdi:heart-outline" className="text-xl" />
                  </Button>
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button size="lg" variant="outline">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
