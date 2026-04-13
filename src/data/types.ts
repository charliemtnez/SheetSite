export interface SiteConfig {
  site_name: string;
  site_description: string;
  nav_logo_url?: string;
  footer_text: string;
}

export interface NavLink {
  label: string;
  href: string;
  order: number;
}

export interface PageEntry {
  slug: string;
  title: string;
  meta_description: string;
  template: "landing" | "directory";
}

export interface Section {
  order: number;
  type: string;
  props: Record<string, string>;
}

export interface FormField {
  name: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  label: string;
  required: boolean;
  pattern?: string;
  validation_message?: string;
  options?: string;
}

export interface FormConfig {
  webhook_url: string;
  success_redirect: string;
  submit_text: string;
  fields: FormField[];
}

export interface DirectoryItem {
  name: string;
  role: string;
  specialty?: string;
  image_url?: string;
  bio: string;
}

export interface DirectoryConfig {
  title: string;
  filter_by?: string;
  items: DirectoryItem[];
}
