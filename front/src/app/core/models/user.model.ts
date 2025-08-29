export interface User {
  ID?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface NewUser {
  nameUser: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateUser {
  IdUser?: string;
  nameUser?: string;
  email?: string;
  phone?: string;
  password?: string;
  userRole?: string;
}
