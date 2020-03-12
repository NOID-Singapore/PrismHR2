interface UserDetailsModel {
  id: number;
  loginName: string;
  displayName: string;
  email: string;
  active: boolean;
  new?: boolean;
}
