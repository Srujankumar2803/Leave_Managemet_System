import axiosClient from './axiosClient';

// === Profile DTOs ===
export interface ProfileDto {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

// === Profile API Functions ===

/**
 * Get current user's profile
 */
export const getProfile = async (): Promise<ProfileDto> => {
  const response = await axiosClient.get<ProfileDto>('/profile');
  return response.data;
};

/**
 * Change user's password
 */
export const changePassword = async (request: ChangePasswordRequest): Promise<PasswordChangeResponse> => {
  const response = await axiosClient.put<PasswordChangeResponse>('/profile/password', request);
  return response.data;
};
