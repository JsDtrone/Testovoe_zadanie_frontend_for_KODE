import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setSearchQuery,
  selectSearchQuery,
  selectSortBy,
  selectIsOnline,
  selectUsersStatus,
  toggleTheme,
  selectTheme,
} from "../userSlice";
import { SortModal } from "./SortModal";

const SearchH1 = styled.h1`
  font-size: 24px;
  margin: 0px 16px 12px 16px;
  color: ${(props) => props.theme.text};

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchWrapper = styled.div`
  width: 100%;
  padding: 0px 16px 0px 16px;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.bg};

  @media (max-width: 768px) {
    padding: 16px 16px 0px 16px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
`;

const SearchLineWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 6px 16px;
  background-color: ${(props) => props.theme.inputBg};
  border-radius: 16px;
`;

const SearchLine = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  color: ${(props) => props.theme.text};

  &::placeholder {
    color: ${(props) => props.theme.textPlaceholder};
    font-weight: 400;
  }
`;
const TemeIcon = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
`;

const SearchIcon = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  margin-right: 12px;
`;

const SortIcon = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  margin-left: 12px;
  cursor: pointer;
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.primary};
  font-size: 16px;
  font-weight: 600;
  padding: 0 4px;
  height: 40px;
  border: none;
  cursor: pointer;
  background: none;
`;

function Search() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const reduxSearchQuery = useAppSelector(selectSearchQuery);
  const sortBy = useAppSelector(selectSortBy);
  const isOnline = useAppSelector(selectIsOnline);
  const status = useAppSelector(selectUsersStatus);
  const currentTheme = useAppSelector(selectTheme);

  const [localValue, setLocalValue] = useState(reduxSearchQuery);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLocalValue(reduxSearchQuery);
  }, [reduxSearchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearchQuery(localValue));
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, dispatch]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(event.target.value);
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith("ru") ? "en" : "ru";
    i18n.changeLanguage(nextLang);
  };

  const sortIconSrc =
    sortBy === "birthday"
      ? "/img/icon-sort-purple.webp"
      : "/img/icon-sort.webp";

  const showOnline = !isOnline || status === "loading";

  return (
    <SearchWrapper>
      {!showOnline && <SearchH1>{t("search.title")}</SearchH1>}

      <HeaderRow>
        <SearchLineWrapper>
          <SearchIcon src="/img/icon-search.png" alt="" />
          <SearchLine
            type="text"
            value={localValue}
            onChange={handleInputChange}
            placeholder={t("search.placeholder")}
          />
          <SortIcon
            src={sortIconSrc}
            alt="Сортировка"
            onClick={() => setIsModalOpen(true)}
          />
        </SearchLineWrapper>

        <ControlsGroup>
          <ActionButton onClick={() => dispatch(toggleTheme())}>
            <TemeIcon
              src={
                currentTheme === "light"
                  ? "/img/icon-dark.webp"
                  : "/img/icon-light.webp"
              }
              alt={currentTheme === "light" ? "🌙" : "☀️"}
            />
          </ActionButton>
          <ActionButton onClick={toggleLanguage}>
            {i18n.language.startsWith("ru") ? "EN" : "RU"}
          </ActionButton>
        </ControlsGroup>
      </HeaderRow>

      <SortModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </SearchWrapper>
  );
}

export default Search;
