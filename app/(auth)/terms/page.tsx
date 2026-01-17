"use client";
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Info,
  Shield,
  Truck,
  CreditCard,
  Users,
  FileText,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  isOpenDefault?: boolean;
}

const TermsPageAccordion = () => {
  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Điều Khoản Sử Dụng</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quy định và quyền lợi khi mua sắm tại ClothingShop. Cập nhật ngày 17/01/2026.
          </p>
        </div>

        {/* Danh sách các mục (Accordion) */}
        <div className="space-y-4">
          <AccordionItem title="Giới Thiệu Chung" icon={<Info className="w-5 h-5" />}>
            Chào mừng bạn đến với ClothingShop. Bằng việc truy cập và sử dụng trang web, bạn đồng ý
            tuân thủ các điều khoản này. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.
          </AccordionItem>

          <AccordionItem title="Tài Khoản & Bảo Mật" icon={<Users className="w-5 h-5" />}>
            Bạn chịu trách nhiệm bảo mật thông tin đăng nhập. ClothingShop không chịu trách nhiệm
            cho tổn thất do lộ thông tin tài khoản từ phía khách hàng.
          </AccordionItem>

          <AccordionItem title="Đặt Hàng & Thanh Toán" icon={<CreditCard className="w-5 h-5" />}>
            Thanh toán được xử lý an toàn. Chúng tôi có quyền hủy đơn hàng nếu phát hiện dấu hiệu
            gian lận hoặc thông tin sai lệch.
          </AccordionItem>

          <AccordionItem
            title="Vận Chuyển & Đổi Trả"
            icon={<Truck className="w-5 h-5" />}
            isOpenDefault={true} // Mặc định mở mục quan trọng này
          >
            <ul className="list-disc pl-5 space-y-2">
              <li>Cam kết giao hàng đúng hẹn.</li>
              <li>
                Đổi trả trong vòng <strong>30 ngày</strong> nếu sản phẩm còn nguyên tem mác.
              </li>
              <li>Phí vận chuyển được tính toán và hiển thị rõ ràng tại trang thanh toán.</li>
            </ul>
          </AccordionItem>

          <AccordionItem title="Quyền Sở Hữu Trí Tuệ" icon={<Shield className="w-5 h-5" />}>
            Toàn bộ hình ảnh, logo, bài viết thuộc bản quyền của ClothingShop. Nghiêm cấm sao chép
            dưới mọi hình thức thương mại mà không có sự cho phép.
          </AccordionItem>

          <AccordionItem title="Thay Đổi Điều Khoản" icon={<FileText className="w-5 h-5" />}>
            Chúng tôi có quyền cập nhật điều khoản bất cứ lúc nào. Thông tin thay đổi sẽ hiệu lực
            ngay khi đăng tải.
          </AccordionItem>
        </div>

        {/* Footer Note */}
        <div className="">
          <div className="mt-10 text-center text-sm text-muted-foreground flex flex-col items-center">
            <p>
              Mọi thắc mắc xin liên hệ{" "}
              <span className="text-primary font-medium cursor-pointer">
                support@clothingshop.com
              </span>
            </p>
          </div>
          <div className="mt-4 text-center">
            <Link href="/sign-up" className="text-sm text-muted-foreground hover:text-primary">
              Quay lại trang <span className="underline text-black font-semibold">đăng ký</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component con Accordion Item
const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  icon,
  isOpenDefault = false,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden transition-all duration-300 hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-card hover:bg-muted transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-2 rounded-lg ${isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {icon}
          </div>
          <span className="font-semibold text-lg text-card-foreground">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="text-muted-foreground" />
        ) : (
          <ChevronDown className="text-muted-foreground" />
        )}
      </button>

      {/* Nội dung trượt */}
      <div
        className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-5 pt-0 text-muted-foreground leading-relaxed border-t border-border mt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TermsPageAccordion;
