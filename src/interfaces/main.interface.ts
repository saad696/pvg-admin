/* eslint-disable @typescript-eslint/no-unused-vars */
interface LoginFormData {
    email: string;
    password: string;
}

interface CreateUserForm {
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    subRole: string;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserContext {
    user: any;
    role: string;
    subRole: string;
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
    timestamp: any;
    uuid: string;
    isRead: boolean;
}

interface IVikinRider {
    name: string;
    mobile: string;
    email: string;
    bio: string;
    profile_picture: any;
    bikes: string[];
    joinedAt: string | Date;
    is_active: boolean;
    user_id: string;
    socials: { [key: string]: string }[];
    blood_group: string;
    rides_joined: { joined_at: any; ride_id: string }[];
    status: 'Active' | 'Deactivated'
}

interface IHostRideForm {
    title: string;
    description: string;
    start_date: string;
    route: string;
    thumbnail: string;
    average_kilometers: number;
    is_published: boolean;
}

interface IHostRide extends IHostRideForm {
    users_joined: { joined_at: any; user_id: string }[];
    status: string;
    uuid: string;
    createdAt: Date | string;
    createdBy: string;
    updatedAt: Date | string;
    updatedBy: string;
}
interface ContactDetailsResult {
    contacts: IContact[];
    lastDoc: any;
}

interface DataType {
    [key: string]: string | number;
}

interface RideStatusCount {
    count: number;
    active: number;
    inactive: number;
    ongoing: number;
    completed: number;
    deleted: number;
}
interface UserStatusCount {
    count: number;
    active: number;
    deactivated: number;
}

interface status {
    ACTIVE: string;
    INACTIVE: string;
    DELETED: string;
    COMPLETED: string;
    ONGOING: string;
}
