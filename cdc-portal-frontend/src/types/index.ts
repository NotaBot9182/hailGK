export interface User {
  id: number;
  name: string;
  email: string;
  role: 'recruiter' | 'admin' | 'super_admin';
}

export interface Company {
  id: number;
  name: string;
  category: 'PSU' | 'Private' | 'MNC' | 'Startup' | 'Govt' | 'NGO';
  website?: string;
  postal_address?: string;
  sector?: string;
  nature_of_business?: string;
  no_of_employees?: string;
  date_of_establishment?: string;
  annual_turnover?: string;
  linkedin_url?: string;
  industry_sector_tags?: string[];
  parent_hq_country?: string;
  parent_hq_city?: string;
  logo_path?: string;
  description?: string;
}

export interface CompanyContact {
  id?: number;
  company_id?: number;
  type: 'head_hr' | 'poc1' | 'poc2';
  name: string;
  designation: string;
  email: string;
  mobile: string;
  landline?: string;
}

export interface Notification {
  id: number;
  company_id: number;
  user_id: number;
  type: 'jnf' | 'inf';
  reference_number: string;
  season: number;
  year: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'changes_requested';
  submitted_at?: string;
  reviewed_at?: string;
  review_notes?: string;
  company?: Company;
  job_profile?: JobProfile;
  intern_profile?: InternProfile;
  salaries?: JnfSalary[];
  eligibility_criteria?: EligibilityCriteria;
  selection_stages?: SelectionStage[];
  selection_infra?: SelectionInfra;
  declaration?: Declaration;
}

export interface JobProfile {
  id?: number;
  notification_id?: number;
  profile_name: string;
  designation?: string;
  place_of_posting: string[];
  work_mode: 'on_site' | 'remote' | 'hybrid';
  expected_hires?: number;
  min_hires?: number;
  tentative_joining_month: string;
  required_skills?: string[];
  job_description?: string;
  jd_pdf_path?: string;
  additional_job_info?: string;
  bond_details?: string;
  registration_link?: string;
  onboarding_procedure?: string;
}

export interface InternProfile {
  id?: number;
  notification_id?: number;
  title: string;
  designation?: string;
  place_of_posting: string[];
  work_mode: 'on_site' | 'remote' | 'hybrid';
  expected_hires?: number;
  min_hires?: number;
  expected_duration_months: number;
  ppo_provision: boolean;
  required_skills?: string[];
  internship_description?: string;
  jd_pdf_path?: string;
  additional_info?: string;
  registration_link?: string;
  onboarding_procedure?: string;
}

export interface JnfSalary {
  id?: number;
  notification_id?: number;
  programme: 'btech_dual' | 'mtech' | 'mba' | 'msc_msctech' | 'phd' | 'ma';
  ctc_annual?: number;
  base_fixed?: number;
  monthly_takehome?: number;
  joining_bonus?: number;
  retention_bonus?: number;
  variable_bonus?: number;
  esop_value?: number;
  esop_vest_period?: string;
  relocation_allowance?: number;
  medical_allowance?: number;
  deductions?: string;
  bond_amount?: number;
  bond_duration_months?: number;
  first_year_ctc?: number;
  stocks_options?: number;
  ctc_breakup?: string;
  gross_salary?: number;
  currency?: 'INR' | 'USD' | 'EUR';
}

export interface EligibilityCriteria {
  id?: number;
  notification_id?: number;
  min_cgpa?: number;
  backlogs_allowed: boolean;
  hs_percentage?: number;
  gender_filter: 'all' | 'male' | 'female' | 'others';
  slp_requirement?: string;
  programmes?: EligibleProgramme[];
}

export interface EligibleProgramme {
  id?: number;
  eligibility_criteria_id?: number;
  programme_code: string;
  programme_name: string;
  min_cpi?: number;
  is_selected: boolean;
}

export interface SelectionStage {
  id?: number;
  notification_id?: number;
  stage_type: string;
  stage_mode?: 'online' | 'offline' | 'hybrid';
  test_type?: string;
  duration_minutes?: number;
  interview_mode?: 'on_campus' | 'telephonic' | 'video_conferencing';
  sort_order: number;
  is_enabled: boolean;
}

export interface SelectionInfra {
  id?: number;
  notification_id?: number;
  team_members_required?: number;
  rooms_required?: number;
  psychometric_test: boolean;
  medical_test: boolean;
  other_screening?: string;
}

export interface Declaration {
  id?: number;
  notification_id?: number;
  aipc_guidelines: boolean;
  shortlisting_commitment: boolean;
  accuracy_profile: boolean;
  consent_ranking_agencies: boolean;
  adherence_toc: boolean;
  rti_nirf_consent: boolean;
  signatory_name?: string;
  signatory_designation?: string;
  signed_at?: string;
  typed_signature?: string;
}

export interface Programme {
  id: number;
  code: string;
  name: string;
  category: string;
  branches?: string[];
  is_active: boolean;
}
