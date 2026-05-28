import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
  selectFilteredUsers,
  selectUsersStatus,
  selectSelectedDep,
  selectSortBy,
  fetchUsersThunk,
} from "../userSlice";
import { type User } from "../types";

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  width: 100%;
  background: transparent;
`;

const StyledSpinner = styled.svg`
  animation: ${rotate} 0.7s linear infinite;
  width: 24px;
  height: 24px;

  & .bg {
    stroke: ${(props) => props.theme.inputBg};
  }

  & .path {
    stroke: ${(props) => props.theme.primary};
    stroke-linecap: round;
  }
`;

const ListWrapper = styled.div`
  width: 100%;
  padding: 20px;
  background-color: ${(props) => props.theme.bg};
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ListItem = styled.div`
  display: flex;
  margin-bottom: 26px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

const UserMainInfo = styled.div`
  display: flex;
  align-items: center;
`;

interface $isLoadProps {
  $isLoad: boolean;
}

const ItemNameRoleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  height: 100px;
  justify-content: center;

  @media (max-width: 768px) {
    margin-left: 16px;
  }
`;

const ItemPhoto = styled.div<$isLoadProps>`
  background-color: ${(props) => props.theme.skeleton};
  width: 100px;
  height: 100px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  animation: ${(props) => (props.$isLoad ? pulse : "none")} 1.5s infinite
    ease-in-out;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemName = styled.div<$isLoadProps>`
  width: ${(props) => (props.$isLoad ? "200px" : "auto")};
  height: ${(props) => (props.$isLoad ? "20px" : "auto")};
  background-color: ${(props) =>
    props.$isLoad ? props.theme.skeleton : "transparent"};
  margin-bottom: 10px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: baseline;
  color: ${(props) => props.theme.text};
  animation: ${(props) => (props.$isLoad ? pulse : "none")} 1.5s infinite
    ease-in-out;

  @media (max-width: 768px) {
    margin-bottom: 3px;
  }
`;

const UserTagSpan = styled.span`
  color: ${(props) => props.theme.textMuted};
  font-size: 13px;
  font-weight: 500;
  margin-left: 4px;
`;

const ItemRole = styled.div<$isLoadProps>`
  width: ${(props) => (props.$isLoad ? "120px" : "auto")};
  height: ${(props) => (props.$isLoad ? "15px" : "auto")};
  border-radius: 8px;
  background-color: ${(props) =>
    props.$isLoad ? props.theme.skeleton : "transparent"};
  color: ${(props) => props.theme.textSecondary};
  font-size: 13px;
  animation: ${(props) => (props.$isLoad ? pulse : "none")} 1.5s infinite
    ease-in-out;
`;

const BirthdayText = styled.div`
  color: ${(props) => props.theme.textSecondary};
  font-size: 15px;
  font-weight: 400;
  margin-right: 10px;

  @media (max-width: 768px) {
    padding-bottom: 10px;
  }
`;

const YearSeparator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0 40px 0;
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: ${(props) => props.theme.border};
    opacity: 0.3;
  }

  span {
    padding: 0 12px;
    color: ${(props) => props.theme.textMuted};
    font-weight: 500;
    font-size: 15px;
  }
`;

const WrongWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-top: 150px;
`;

const WrongImg = styled.img`
  height: 60px;
  width: auto;
  margin-bottom: 10px;
`;

const WrongHeader = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.text};
  margin-bottom: 10px;
`;

const WrongBody = styled.div`
  font-size: 15px;
  color: ${(props) => props.theme.textSecondary};
  margin-bottom: 5px;
`;

const WrongRefresh = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.primary};
  cursor: pointer;
  padding: 5px 10px;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-top: 150px;
`;

const EmptyImg = styled.img`
  height: 56px;
  width: auto;
  margin-bottom: 16px;
`;

const EmptyHeader = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: ${(props) => props.theme.text};
  margin-bottom: 12px;
`;

const EmptyBody = styled.div`
  font-size: 15px;
  color: ${(props) => props.theme.textMuted};
`;

function List() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const filteredUsers = useAppSelector(selectFilteredUsers);
  const status = useAppSelector(selectUsersStatus);
  const selectedDep = useAppSelector(selectSelectedDep);
  const sortBy = useAppSelector(selectSortBy);

  const formatBirthday = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const locale = i18n.language.startsWith("ru") ? "ru-RU" : "en-US";
    return date
      .toLocaleDateString(locale, { day: "numeric", month: "short" })
      .replace(".", "");
  };

  const handleRefresh = async () => {
    await dispatch(
      fetchUsersThunk({ department: selectedDep, forceRefresh: true }),
    );
  };

  const customSpinner = (
    <SpinnerWrapper>
      <StyledSpinner viewBox="0 0 50 50">
        <circle
          className="bg"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="2.5"
          opacity="0.1"
        />
        <circle
          className="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="2.5"
          strokeDasharray="35 150"
        />
      </StyledSpinner>
    </SpinnerWrapper>
  );

  if (status === "loading") {
    const skeletonItems = Array(4).fill(null);
    return (
      <ListWrapper>
        {skeletonItems.map((_, index) => (
          <ListItem key={`skeleton-${index}`}>
            <UserMainInfo>
              <ItemPhoto $isLoad={true} />
              <ItemNameRoleWrapper>
                <ItemName $isLoad={true} />
                <ItemRole $isLoad={true} />
              </ItemNameRoleWrapper>
            </UserMainInfo>
          </ListItem>
        ))}
      </ListWrapper>
    );
  }

  if (status === "failed" && filteredUsers.length === 0) {
    return (
      <ListWrapper>
        <WrongWrapper>
          <WrongImg src="/img/nlo.webp" alt="Error" />
          <WrongHeader>{t("search.failed_header")}</WrongHeader>
          <WrongBody>{t("search.failed_body")}</WrongBody>
          <WrongRefresh onClick={handleRefresh}>
            {t("search.failed_refresh")}
          </WrongRefresh>
        </WrongWrapper>
      </ListWrapper>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <ListWrapper>
        <EmptyWrapper>
          <EmptyImg
            src="/img/left-pointing-magnifying-glass_1f50d.webp"
            alt="Not found"
          />
          <EmptyHeader>{t("search.empty_header")}</EmptyHeader>
          <EmptyBody>{t("search.empty_body")}</EmptyBody>
        </EmptyWrapper>
      </ListWrapper>
    );
  }

  const today = new Date();
  const currentYear = today.getFullYear();

  const renderUserItem = (user: User) => {
    const fullName = `${user.firstName} ${user.lastName}`;
    return (
      <ListItem key={user.id} onClick={() => navigate(`/user/${user.id}`)}>
        <UserMainInfo>
          <ItemPhoto $isLoad={false}>
            <img src={user.avatarUrl || "/img/guse.webp"} alt="Avatar" />
          </ItemPhoto>
          <ItemNameRoleWrapper>
            <ItemName $isLoad={false}>
              {fullName}
              {user.userTag && (
                <UserTagSpan>{user.userTag.toLowerCase()}</UserTagSpan>
              )}
            </ItemName>
            <ItemRole $isLoad={false}>{user.position}</ItemRole>
          </ItemNameRoleWrapper>
        </UserMainInfo>

        {sortBy === "birthday" && (
          <BirthdayText>{formatBirthday(user.birthday)}</BirthdayText>
        )}
      </ListItem>
    );
  };

  if (sortBy === "birthday") {
    const thisYearUsers: User[] = [];
    const nextYearUsers: User[] = [];

    filteredUsers.forEach((user) => {
      const birthDate = new Date(user.birthday);
      const thisYearBirthday = new Date(
        currentYear,
        birthDate.getMonth(),
        birthDate.getDate(),
      );
      thisYearBirthday.setHours(0, 0, 0, 0);
      const todayReset = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );

      if (thisYearBirthday >= todayReset) {
        thisYearUsers.push(user);
      } else {
        nextYearUsers.push(user);
      }
    });

    return (
      <PullToRefresh
        onRefresh={handleRefresh}
        pullingContent=""
        refreshingContent={customSpinner}
      >
        <ListWrapper>
          {thisYearUsers.map(renderUserItem)}

          {nextYearUsers.length > 0 && (
            <YearSeparator>
              <span>{currentYear + 1}</span>
            </YearSeparator>
          )}

          {nextYearUsers.map(renderUserItem)}
        </ListWrapper>
      </PullToRefresh>
    );
  }

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      pullingContent=""
      refreshingContent={customSpinner}
    >
      <ListWrapper>{filteredUsers.map(renderUserItem)}</ListWrapper>
    </PullToRefresh>
  );
}

export default List;
