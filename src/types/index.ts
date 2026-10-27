export type UserRole = 'admin' | 'counselor' | 'user';

export interface UserAccount {
  id: string;
  email: string;
  password?: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_verified?: boolean;
  created_at: string;
}

export type EnquiryServiceType = 
  | 'admission' 
  | 'career_guidance' 
  | 'flexible_learning' 
  | 'sslc_puc' 
  | 'recruitment' 
  | 'general';

export type EnquiryStatus = 
  | 'new' 
  | 'contacted' 
  | 'qualified' 
  | 'follow_up' 
  | 'converted' 
  | 'closed';

export interface EnquiryNote {
  id: string;
  enquiry_id: string;
  author: string;
  content: string;
  created_at: string;
}

export interface Enquiry {
  id: string;
  created_at: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone: string;
  service_type: EnquiryServiceType;
  status: EnquiryStatus;
  source_page?: string;
  message?: string;
  consent_given: boolean;

  // Specific contextual fields
  interested_program?: string;
  education_level?: string;
  learning_mode?: 'online' | 'distance' | 'blended' | 'regular' | 'flexible';
  city_district?: string;
  current_status?: string;
  area_of_interest?: string;
  career_goal?: string;
  preferred_contact_method?: 'whatsapp' | 'phone' | 'email';
  organization_name?: string;
  recruitment_requirement?: string;
  number_of_positions?: string;

  // CRM fields
  assigned_to?: string;
  follow_up_date?: string;
  notes?: EnquiryNote[];
}

export type ProgramCategory = 
  | 'undergraduate' 
  | 'postgraduate' 
  | 'diploma' 
  | 'sslc_puc' 
  | 'certification' 
  | 'flexible';

export interface Program {
  id: string;
  title: string;
  slug: string;
  category: ProgramCategory;
  short_description: string;
  full_description: string;
  eligibility: string;
  learning_mode: string;
  duration: string;
  fees: string;
  is_published: boolean;
  featured: boolean;
  icon_name?: string;
  created_at: string;
}

export interface FilterOptions {
  search?: string;
  service_type?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image: string;
  category: string;
  author: string;
  is_published: boolean;
  published_at: string;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
}

