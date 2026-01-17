"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative bg-linear-to-r from-primary/10 to-secondary/10 py-20">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Discover Your
            <span className="text-primary block">Style</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Explore our curated collection of premium clothing for every occasion. Quality, comfort,
            and style that speaks to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Shop Now
              </Button>
            </Link>
            <Link href="/collections">
              <Button size="lg" variant="outline">
                View Collections
              </Button>
            </Link>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="relative w-96 h-96">
            {/* Placeholder for hero image */}
            <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
              <span className="text-6xl">👗</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
