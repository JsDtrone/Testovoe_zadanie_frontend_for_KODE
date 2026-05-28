import {
  createSlice,
  type PayloadAction,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { type RootState } from "./store";
import {
  type UsersState,
  type Department,
  type User,
  type SortType,
  type ThemeType,
} from "./types";
import { getUsers } from "./api/userApi";

const getSystemTheme = (): ThemeType => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

const initialState: UsersState = {
  items: [],
  selectedDepartment: "all",
  status: "loading",
  searchQuery: "",
  sortBy: "alphabet",
  isOnline: typeof window !== "undefined" ? navigator.onLine : true,
  cache: {},
  theme: getSystemTheme(),
};

export const fetchUsersThunk = createAsyncThunk<
  User[],
  { department: Department; forceRefresh?: boolean },
  { state: RootState }
>(
  "users/fetchUsersThunk",
  async ({ department }, { rejectWithValue }) => {
    const response = await getUsers({ department, dynamic: false });
    if (response.statusCode === 500) {
      return rejectWithValue("Ошибка сервера");
    }
    return response.items;
  },
  {
    condition: ({ department, forceRefresh }, { getState }) => {
      if (forceRefresh) return true;

      const { users } = getState();
      const cachedData = users.cache[department];

      if (cachedData) {
        if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
          return false;
        }
      }
      return true;
    },
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setDepartment: (state, action: PayloadAction<Department>) => {
      state.selectedDepartment = action.payload;
      const cachedData = state.cache[action.payload];
      if (cachedData && Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
        state.items = cachedData.items;
        state.status = "ok";
        return;
      }
      state.items = [];
      state.status = "loading";
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortType>) => {
      state.sortBy = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.status = "ok";
        state.items = action.payload;
        state.cache[action.meta.arg.department] = {
          items: action.payload,
          timestamp: Date.now(),
        };
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        if (action.meta.condition) return;
        state.status = "failed";
      });
  },
});

export const {
  setDepartment,
  setSearchQuery,
  setSortBy,
  setOnlineStatus,
  toggleTheme,
  setTheme,
} = usersSlice.actions;
export default usersSlice.reducer;

export const selectAllUsers = (state: RootState) => state.users.items;
export const selectSelectedDep = (state: RootState) =>
  state.users.selectedDepartment;
export const selectUsersStatus = (state: RootState) => state.users.status;
export const selectSearchQuery = (state: RootState) => state.users.searchQuery;
export const selectSortBy = (state: RootState) => state.users.sortBy;
export const selectIsOnline = (state: RootState) => state.users.isOnline;
export const selectTheme = (state: RootState) => state.users.theme;

export const selectFilteredUsers = createSelector(
  [selectAllUsers, selectSearchQuery, selectSortBy],
  (items, searchQuery, sortBy) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    let filtered = items;

    if (normalizedQuery) {
      filtered = items.filter((user) => {
        const first = user.firstName?.toLowerCase().includes(normalizedQuery);
        const last = user.lastName?.toLowerCase().includes(normalizedQuery);
        const tag = user.userTag?.toLowerCase().includes(normalizedQuery);
        const email = (user as any).email
          ?.toLowerCase()
          .includes(normalizedQuery);
        return first || last || tag || email;
      });
    }

    const sorted = [...filtered];

    if (sortBy === "alphabet") {
      sorted.sort((a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
          "ru",
        ),
      );
    } else if (sortBy === "birthday") {
      const today = new Date();
      const currentYear = today.getFullYear();
      const getNextBirthday = (birthStr: string) => {
        const d = new Date(birthStr);
        const target = new Date(currentYear, d.getMonth(), d.getDate());
        target.setHours(0, 0, 0, 0);
        if (
          target <
          new Date(today.getFullYear(), today.getMonth(), today.getDate())
        ) {
          target.setFullYear(currentYear + 1);
        }
        return target;
      };
      sorted.sort(
        (a, b) =>
          getNextBirthday(a.birthday).getTime() -
          getNextBirthday(b.birthday).getTime(),
      );
    }

    return sorted;
  },
);

export const selectUserById = (id: string) => (state: RootState) =>
  state.users.items.find((user) => user.id === id);
