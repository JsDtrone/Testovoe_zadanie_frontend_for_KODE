import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../hooks";
import { selectUserById } from "../userSlice";

const ProfileWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${(props) => props.theme.bg};
`;

const ProfileWidth = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0px auto;
`;

const HeaderBlock = styled.div`
  padding: 24px 20px 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.surface};
`;

const BackButton = styled.button`
  position: absolute;
  left: 20px;
  top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
`;

const BackIcon = styled.img<{ isDark: boolean }>`
  height: 16px;
  filter: ${(props) => (props.isDark ? "invert(1)" : "none")};
`;

const Avatar = styled.img`
  width: 104px;
  height: 104px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 24px;
  background-color: ${(props) => props.theme.skeleton};
`;

const UserName = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => props.theme.text};
  margin: 0 0 12px 0;
  display: flex;
  align-items: baseline;
`;

const UserShort = styled.div`
  color: ${(props) => props.theme.textMuted};
  font-size: 17px;
  font-weight: 500;
  margin: 1px 0px auto 4px;
`;

const UserPosition = styled.div`
  font-size: 13px;
  color: ${(props) => props.theme.textSecondary};
  font-weight: 400;
`;

const InfoBlock = styled.div`
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const InfoRow = styled.div<{ $justify?: string }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.$justify || "space-between"};
`;

const InfoLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.text};
`;

const PhoneLink = styled.a`
  text-decoration: none;
  color: inherit;
`;

const Icon = styled.img<{ isDark: boolean }>`
  width: 24px;
  height: 24px;
  filter: ${(props) => (props.isDark ? "invert(0.8)" : "none")};
`;

const AgeText = styled.div`
  font-size: 16px;
  color: ${(props) => props.theme.textMuted};
  font-weight: 500;
`;

const NoFound = styled.div`
  padding: 40px;
  text-align: center;
  font-size: 18px;
`;

function UserProfile() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = useAppSelector(selectUserById(id || ""));
  const isDark = useAppSelector((state) => state.users.theme === "dark");

  if (!user) {
    return <NoFound>{t("profile.not_found")}</NoFound>;
  }

  const getAge = (birthdayString: string) => {
    if (!birthdayString) return 0;
    const today = new Date();
    const birthDate = new Date(birthdayString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getAgeString = (age: number) => {
    const currentLang = i18n.language.startsWith("ru") ? "ru" : "en";

    if (currentLang === "en") {
      return t("profile.age_many", { ageOst: age });
    }

    let ageOst = age % 100;
    if (ageOst >= 5 && ageOst <= 20) {
      return t("profile.age_many", { ageOst: age });
    }
    ageOst = ageOst % 10;
    if (ageOst === 1) {
      return t("profile.age_one", { ageOst: age });
    }
    if (ageOst >= 2 && ageOst <= 4) {
      return t("profile.age_few", { ageOst: age });
    }
    return t("profile.age_many", { ageOst: age });
  };

  const formatFullBirthday = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const locale = i18n.language.startsWith("ru") ? "ru-RU" : "en-US";
    return date
      .toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .replace(" г.", "");
  };

  const formatPhoneNumber = (phoneString: string) => {
    if (!phoneString) return "";
    const cleaned = phoneString.replace(/\D/g, "");

    if (cleaned.length === 11) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 11)}`;
    }
    return phoneString;
  };

  const age = getAge(user.birthday);

  return (
    <ProfileWrapper>
      <ProfileWidth>
        <HeaderBlock>
          <BackButton onClick={() => navigate("/")}>
            <BackIcon src="/img/icon-back.webp" alt="Back" isDark={isDark} />
          </BackButton>

          <Avatar
            src={user.avatarUrl || "/img/guse.webp"}
            alt={user.firstName}
          />

          <UserName>
            {user.firstName} {user.lastName}
            {user.userTag && (
              <UserShort>{user.userTag.toLowerCase()}</UserShort>
            )}
          </UserName>

          <UserPosition>{user.position}</UserPosition>
        </HeaderBlock>

        <InfoBlock>
          <InfoRow>
            <InfoLeft>
              <Icon src="/img/icon-star.webp" alt="Birthday" isDark={isDark} />
              {formatFullBirthday(user.birthday)}
            </InfoLeft>
            <AgeText>{getAgeString(age)}</AgeText>
          </InfoRow>

          <InfoRow $justify="flex-start">
            <InfoLeft>
              <Icon src="/img/icon-phone.webp" alt="Phone" isDark={isDark} />
              <PhoneLink href={`tel:${user.phone}`}>
                {formatPhoneNumber(user.phone)}
              </PhoneLink>
            </InfoLeft>
          </InfoRow>
        </InfoBlock>
      </ProfileWidth>
    </ProfileWrapper>
  );
}

export default UserProfile;
