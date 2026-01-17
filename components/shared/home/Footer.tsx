"use client";
import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:shopping" className="text-primary text-2xl" />
              <span className="text-xl font-bold text-primary">FashionHub</span>
            </div>
            <p className="text-muted-foreground">
              Your premier destination for quality fashion and lifestyle products.
            </p>
            <div className="flex space-x-4">
              <Icon
                icon="mdi:facebook"
                className="text-xl text-muted-foreground hover:text-primary cursor-pointer"
              />
              <Icon
                icon="mdi:instagram"
                className="text-xl text-muted-foreground hover:text-primary cursor-pointer"
              />
              <Icon
                icon="mdi:twitter"
                className="text-xl text-muted-foreground hover:text-primary cursor-pointer"
              />
              <Icon
                icon="mdi:linkedin"
                className="text-xl text-muted-foreground hover:text-primary cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-primary">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="text-muted-foreground hover:text-primary">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-muted-foreground hover:text-primary">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-muted-foreground hover:text-primary">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Stay Updated</h3>
            <p className="text-muted-foreground">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-border rounded-l-md bg-background text-foreground"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© 2026 FashionHub. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary text-sm">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-primary text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
