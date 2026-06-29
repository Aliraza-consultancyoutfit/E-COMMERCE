export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  createdAt: string;
}

export interface TeamResponse {
  records: TeamMember[];
  meta: { total: number; page: number; limit: number; pages: number };
}

export interface TeamQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateAdminArgs {
  name?: string;
  email: string;
  password: string;
}
