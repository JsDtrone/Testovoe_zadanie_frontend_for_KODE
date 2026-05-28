import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  setOnlineStatus,
  fetchUsersThunk,
  selectSelectedDep,
  selectIsOnline,
  selectUsersStatus,
  selectTheme,
  setTheme,
} from "./userSlice";
import { lightTheme, darkTheme } from "./theme";
import "./App.css";
import Search from "./components/Search";
import Selection from "./components/Selection";
import styled from "styled-components";
import List from "./components/UserList";
import UserProfile from "./components/UserProfile";

const MobileToast = styled.div<{ type: "error" | "loading" }>`
  position: fixed;
  bottom: 24px;
  left: 16px;
  right: 16px;
  padding: 14px 16px;
  background-color: ${(props) =>
    props.type === "error" ? "#F44336" : "#6534ff"};
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 20;

  @media (min-width: 769px) {
    position: static;
    border-radius: 0px;
    box-shadow: none;
    padding: 16px 16px 12px 16px;
    margin-bottom: 0px;
  }
`;

const DesktopBannerTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-left: 4px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const AppWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  margin: 0px auto;
  background-color: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text};
`;

const AppWidth = styled.div`
  max-width: 1280px;
  width: 100%;
`;

const Fixed = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  padding-top: 22px;
  background-color: ${(props) => props.theme.bg};

  @media (max-width: 768px) {
    padding-top: 8px;
  }
`;

function MainScreen() {
  const { t } = useTranslation();
  const isOnline = useAppSelector(selectIsOnline);
  const status = useAppSelector(selectUsersStatus);

  return (
    <AppWrapper>
      <AppWidth>
        {!isOnline && (
          <MobileToast type="error">
            <DesktopBannerTitle>{t("search.title")}</DesktopBannerTitle>
            <div>{t("search.error_banner")}</div>
          </MobileToast>
        )}

        {isOnline && status === "loading" && (
          <MobileToast type="loading">
            <DesktopBannerTitle>{t("search.title")}</DesktopBannerTitle>
            <div>{t("search.loading_banner")}</div>
          </MobileToast>
        )}

        <Fixed>
          <Search />
          <Selection />
        </Fixed>
        <List />
      </AppWidth>
    </AppWrapper>
  );
}

function App() {
  const dispatch = useAppDispatch();
  const selectedDep = useAppSelector(selectSelectedDep);
  const currentThemeType = useAppSelector(selectTheme);

  useEffect(() => {
    const handleOnline = () => {
      dispatch(setOnlineStatus(true));
      dispatch(
        fetchUsersThunk({ department: selectedDep, forceRefresh: true }),
      );
    };

    const handleOffline = () => {
      dispatch(setOnlineStatus(false));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch, selectedDep]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      dispatch(setTheme(e.matches ? "dark" : "light"));
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [dispatch]);

  const activeTheme = currentThemeType === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={activeTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/user/:id" element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
