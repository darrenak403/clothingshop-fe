import apiClient from "../core";

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: {
      userId: string;
      email: string;
      fullName: string;
      phoneNumber?: string;
      roleName: string;
    };
  };
}

class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/refresh-token", {
      refreshToken,
    });
    return response.data;
  }

  async logout(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/logout", {
      refreshToken,
    });
    return response.data;
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/forgot-password", data);
    return response.data;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/change-password", data);
    return response.data;
  }
}

export const authService = new AuthService();
