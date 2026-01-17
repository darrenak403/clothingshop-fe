"use client";
import Header from "@/components/shared/home/Header";
import Hero from "@/components/shared/home/Hero";
import FeaturedProducts from "@/components/shared/home/FeaturedProducts";
import Footer from "@/components/shared/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FeaturedProducts />
      <Footer />
    </div>
  );
}
