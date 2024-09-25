export interface User {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  country: string;
  city: string;
  street: string;
  house: string;
  phone: string;
}

export type Region = "en" | "fr" | "pl" | "random";
