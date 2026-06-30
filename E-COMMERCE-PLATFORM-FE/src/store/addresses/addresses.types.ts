export interface Address {
  _id: string;
  user: string;
  label: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zip: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressArgs {
  label: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zip: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UpdateAddressArgs {
  id: string;
  body: Partial<CreateAddressArgs>;
}

export interface DeleteAddressResponse {
  success: boolean;
}
