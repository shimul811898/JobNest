export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  bio?: string;
  authProvider?: 'local' | 'google';
  createdAt: string;
  updatedAt: string;
}

export interface Salary {
  min: number;
  max: number;
  currency: string;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  companyLogo?: string;
  shortDescription: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  salary: Salary;
  category: JobCategory;
  type: JobType;
  experience: ExperienceLevel;
  skills: string[];
  benefits: string[];
  postedBy: User | string;
  isActive: boolean;
  applicationDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  jobId: Job | string;
  userId: User | string;
  coverLetter: string;
  resumeUrl?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export type JobCategory = 
  | 'Technology' | 'Finance' | 'Marketing' | 'Healthcare' 
  | 'Education' | 'Design' | 'Sales' | 'Engineering' | 'Legal' | 'Other';

export type JobType = 'Remote' | 'Onsite' | 'Hybrid';

export type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior' | 'Lead' | 'Director';

export interface PaginatedResponse<T> {
  jobs: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Stats {
  totalJobs: number;
  totalCompanies: number;
  totalUsers: number;
  categoryCounts: Record<string, number>;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface JobFilters {
  search?: string;
  category?: string;
  type?: string;
  experience?: string;
  minSalary?: number;
  maxSalary?: number;
  sort?: string;
  page?: number;
  limit?: number;
}
