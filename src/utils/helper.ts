import { auth } from "../firebase/firebase";

export const helperService = {
  logout: () => {
    auth.signOut();
    sessionStorage.clear();
    location.assign(`${location.origin}/auth/login`);
  },
  defaultRoute: (role: string): string => {
    return role === "admin"
      ? "/portfolio/basic-details"
      : `${role}/basic-details`;
  },
  removeRepeatingStrings: (input: string): string => {
    const tags = input.split(",").map((tag) => tag.trim());
    const uniqueTags = Array.from(new Set(tags));
    return uniqueTags.join(", ");
  },
  isObject: (val: any) => {
    if (val === null) {
      return false;
    }
    return typeof val === "function" || typeof val === "object";
  },
};
