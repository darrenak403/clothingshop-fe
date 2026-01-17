"use client";
import React from "react";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-card p-6 rounded-lg border border-border">
        <p className="text-muted-foreground">Chào mừng, {user?.name}</p>
        <p className="mt-2">
          Bạn đang đăng nhập với quyền:{" "}
          <span className="font-semibold text-primary">{user?.role}</span>
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
