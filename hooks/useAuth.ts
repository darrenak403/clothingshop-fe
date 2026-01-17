/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { authService } from "@/lib/api/services/authService";
import { logout as logoutAction, setCredentials } from "@/lib/redux/slices/authSlice";
import type { RootState } from "@/lib/redux/store";
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/lib/api/services/authService";

export function useAuth() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated, refreshToken } = useSelector((state: RootState) => state.auth);

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập");
        router.push("/sign-in");
      } else {
        toast.error(data.message || "Đăng ký thất bại");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Đăng ký thất bại");
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Update Redux state
        dispatch(
          setCredentials({
            user: {
              id: data.data.user.id,
              email: data.data.user.email,
              name: data.data.user.fullName,
              role: "user", // Default role
            },
            token: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          })
        );

        toast.success("Đăng nhập thành công");
        router.push("/");
      } else {
        toast.error(data.message || "Đăng nhập thất bại");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Đăng nhập thất bại");
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: (refreshToken: string) => authService.logout(refreshToken),
    onSuccess: (data) => {
      if (data.success) {
        // Dispatch logout action to clear Redux state
        dispatch(logoutAction());
        toast.success("Đăng xuất thành công");
        router.push("/sign-in");
      } else {
        toast.error(data.message || "Đăng xuất thất bại");
      }
    },
    onError: (error: any) => {
      // Still clear Redux state even if API call fails
      dispatch(logoutAction());
      toast.error("Đăng xuất thành công");
      router.push("/sign-in");
    },
  });

  // Refresh token mutation
  const refreshTokenMutation = useMutation({
    mutationFn: (refreshToken: string) => authService.refreshToken(refreshToken),
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Update Redux state with new tokens
        dispatch(
          setCredentials({
            user: {
              id: data.data.user.id,
              email: data.data.user.email,
              name: data.data.user.fullName,
              role: "user", // Default role
            },
            token: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          })
        );
      }
    },
    onError: () => {
      // Token refresh failed, clear Redux state and redirect to login
      dispatch(logoutAction());
      router.push("/sign-in");
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Email đặt lại mật khẩu đã được gửi!");
      } else {
        toast.error(data.message || "Gửi email thất bại");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gửi email thất bại");
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Mật khẩu đã được đặt lại thành công!");
        router.push("/sign-in");
      } else {
        toast.error(data.message || "Đặt lại mật khẩu thất bại");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Đặt lại mật khẩu thất bại");
    },
  });

  return {
    // Auth state
    user,
    isAuthenticated,

    // Register
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,

    // Login
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,

    // Logout
    logout: () => {
      if (refreshToken) {
        logoutMutation.mutate(refreshToken);
      } else {
        // Fallback: dispatch logout action directly if no refresh token
        dispatch(logoutAction());
        toast.success("Đăng xuất thành công");
        router.push("/sign-in");
      }
    },
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,

    // Refresh token
    refreshToken: (token: string) => refreshTokenMutation.mutate(token),
    refreshTokenAsync: refreshTokenMutation.mutateAsync,
    isRefreshingToken: refreshTokenMutation.isPending,

    // Forgot password
    forgotPassword: forgotPasswordMutation.mutate,
    forgotPasswordAsync: forgotPasswordMutation.mutateAsync,
    isSendingResetEmail: forgotPasswordMutation.isPending,

    // Reset password
    resetPassword: resetPasswordMutation.mutate,
    resetPasswordAsync: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
  };
}
