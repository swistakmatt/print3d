export interface User {
  _id?: string;
  admin: boolean;
  email: string;
  username: string;
  phone: string;
  token: string;
}

export interface UserRegister {
  email: string;
  username: string;
  phone: string;
  password: string;
}
