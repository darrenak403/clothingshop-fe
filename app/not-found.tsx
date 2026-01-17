"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react"; // Vẫn giữ Iconify nếu bạn thích icon đa dạng

const NotFoundPageFashion = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl rounded-3xl border-0">
        {/* Cột trái: Hình ảnh/Icon minh họa */}
        <div className="bg-primary p-10 flex flex-col items-center justify-center text-primary-foreground relative overflow-hidden">
          {/* Pattern background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[16px_16px]"></div>

          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            {/* Icon Móc áo - Biểu tượng cho shop thời trang */}
            <Icon icon="mdi:hanger" className="text-9xl text-primary-foreground/90" />
          </motion.div>

          <div className="mt-8 text-center z-10">
            <h2 className="text-6xl font-black tracking-tighter text-primary-foreground">404</h2>
          </div>
        </div>

        {/* Cột phải: Nội dung & Hành động */}
        <div className="p-10 flex flex-col justify-center bg-white">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Tủ đồ này đang trống!</h3>
              <p className="text-slate-500 leading-relaxed">
                Xin lỗi, chúng tôi đã lục tung cả kho hàng nhưng không tìm thấy trang bạn yêu cầu.
                Có thể đường dẫn đã cũ hoặc bị hỏng.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Link href="/" className="w-full block">
                <Button className="w-full h-12 text-base font-medium">
                  <Icon icon="mdi:home-outline" className="mr-2 text-xl" />
                  Về trang chủ mua sắm
                </Button>
              </Link>

              <Link href="/products" className="w-full block">
                <Button
                  variant="outline"
                  className="w-full h-12 text-base text-muted-foreground hover:text-foreground border-muted-foreground/20 hover:border-muted-foreground/40"
                >
                  <Icon icon="mdi:tshirt-crew-outline" className="mr-2 text-xl" />
                  Xem sản phẩm mới
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPageFashion;
