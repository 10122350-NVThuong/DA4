export interface LoginResponse {
  accessToken?: string;
  user?: any;

  require_change_password?: boolean;
  user_id?: string;
  message?: string;
}
