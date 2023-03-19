export interface AppContextInterface {}

export interface UserProps {
  name: string;
  surname: string;
  email: string;
}

export interface AppProviderProps {
  children?: React.ReactNode;
}
