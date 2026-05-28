import "styled-components";

export type Department =
  | "all"
  | "android"
  | "ios"
  | "design"
  | "management"
  | "qa"
  | "back_office"
  | "frontend"
  | "hr"
  | "pr"
  | "backend"
  | "support"
  | "analytics";

export interface User {
  id: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  userTag: string;
  department: Exclude<Department, "all">;
  position: string;
  birthday: string;
  phone: string;
}

export interface FetchUserParams {
  department?: Department;
  dynamic?: boolean;
  code?: number;
}

export interface UsersResponse {
  items: User[];
  statusCode: number;
}

export type LoadingStatus = "ok" | "loading" | "failed";
export type SortType = "alphabet" | "birthday";
export type ThemeType = "light" | "dark";

export interface CacheItem {
  items: User[];
  timestamp: number;
}

export interface UsersState {
  items: User[];
  selectedDepartment: Department;
  status: LoadingStatus;
  searchQuery: string;
  sortBy: SortType;
  isOnline: boolean;
  cache: Record<string, CacheItem>;
  theme: ThemeType;
}
declare module "styled-components" {
  export interface DefaultTheme {
    type: ThemeType;
    bg: string;
    text: string;
    textSecondary: string;
    surface: string;
    inputBg: string;
    divider: string;
    primary: string;
    accent: string;
    overlay: string;
    textMuted: string;
    textPlaceholder: string;
    border: string;
    skeleton: string;
  }
}
