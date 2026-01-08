/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  loginAsync,
  logoutAsync,
  registerAsync,
  refreshTokenAsync,
  selectAuth,
} from "@/lib/redux/slices/authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector(selectAuth);

  const register = async (credentials: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) => {
    try {
      const result = await dispatch(registerAsync(credentials)).unwrap();
      toast.success("Đăng ký thành công! Vui lòng đăng nhập");
      router.push("/login");
      return result;
    } catch (error: any) {
      toast.error(error || "Đăng ký thất bại");
      throw error;
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const result = await dispatch(loginAsync(credentials)).unwrap();
      toast.success("Đăng nhập thành công");
      router.push("/dashboard");
      return result;
    } catch (error: any) {
      toast.error(error || "Đăng nhập thất bại");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      toast.success("Đăng xuất thành công");
      router.push("/login");
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const refreshToken = async () => {
    try {
      const result = await dispatch(refreshTokenAsync()).unwrap();
      return result;
    } catch (error: any) {
      toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
      router.push("/login");
      throw error;
    }
  };

  return {
    ...auth,
    register,
    login,
    logout,
    refreshToken,
  };
}
