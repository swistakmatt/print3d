export interface User {
  userId: string;
  admin: boolean;
  username: string;
  email: string;
  token?: string;
  phone?: string;
}
