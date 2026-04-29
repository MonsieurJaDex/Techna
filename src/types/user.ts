export type User = {
  id: string;
  name: string;
  department: string;
  vacationDays: number;
};

export type AuthResponse = {
  token: string;
  user: User;
};

