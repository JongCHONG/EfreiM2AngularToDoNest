export interface UserType {
  uid: string;
  email: string;
  surname: string;
  loginAttempts: number;
  isBlocked: boolean;
  blockUntil?: Date | null;
}