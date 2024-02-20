interface LoginFormData {
  email: string;
  password: string;
}

interface CreateUserForm {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserContext {
  user: any;
  role: string;
  isLoggedIn: boolean;
}

interface BasicDetailsPayload {
  [key: string]: any;
}

interface UpdatedBy {
  dateTime: number;
  user: string;
}

interface BasicDetails {
  bio: string;
  email: string;
  [key: string]: any;
  mobile: string;
  skills: string[];
  updatedBy: UpdatedBy[];
}

interface BlogDetails {
  title: string;
  summary: string;
  thumbnail: any;
  content: string;
  published: boolean;
  tags: string[];
  feature: boolean;
  createAt?: Date;
  updatedAt?: Date;
  createdBy: string;
  updatedBy: string;
  uuid: string;
  status: string;
}

interface IUploadedBlogthumbnail {
  name: string;
  status: string;
  url: string;
  uid?: string;
}

interface IProject {
  name: string;
  description: string;
  thumbnail: any;
  duration: any;
  tech: string[];
  url: string;
  uuid: string;
  status: string;
  images: string[];
}

interface IExperience {
  title: string;
  employment_type: string;
  company_name: string;
  location: string;
  location_type: string;
  currently_working: boolean;
  start_date: string | Date;
  end_date?: string | Date;
  description: string;
  skills_used: string[];
  uuid: string;
  status: string;
}

interface IContact {
  email: string;
  mobile: string;
  name: string;
  subject: string;
  query: string;
  timestamp: Date;
  uuid: string;
}

interface ContactDetailsResult {
  contacts: IContact[];
  lastDoc: any;
}
