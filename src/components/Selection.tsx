import { useEffect, useRef } from "react";
import styled from "styled-components";
import { register } from "swiper/element/bundle";
import { useTranslation } from "react-i18next";
import { type Department } from "../types";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setDepartment,
  selectSelectedDep,
  fetchUsersThunk,
} from "../userSlice";

register();

const StyledSwiperContainer = styled("swiper-container" as any)`
  width: 100%;
  padding: 0px 16px;
  margin-top: 20px;
  border-bottom: 1px solid ${(props) => props.theme.divider};
  display: block;
  background-color: ${(props) => props.theme.bg};
`;

interface SelectionItemProps {
  isActive: boolean;
}

const StyledSwiperSlide = styled("swiper-slide" as any)<SelectionItemProps>`
  width: auto;
  text-align: center;
  font-weight: ${(props) => (props.isActive ? "500" : "400")};
  cursor: grab;
  padding: 0px 7px 8px 8px;
  border-bottom: 2px solid
    ${(props) => (props.isActive ? props.theme.primary : "transparent")};
  color: ${(props) =>
    props.isActive ? props.theme.text : props.theme.textMuted};
`;

const Text = styled.div`
  padding: 0px 5px 4px 5px;
  cursor: pointer;
`;

const Departments: Department[] = [
  "all",
  "android",
  "ios",
  "design",
  "management",
  "qa",
  "back_office",
  "frontend",
  "hr",
  "pr",
  "backend",
  "support",
  "analytics",
];

function Selection() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedDep = useAppSelector(selectSelectedDep);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    dispatch(fetchUsersThunk({ department: "all" }));
  }, [dispatch]);

  useEffect(() => {
    if (swiperRef.current) {
      const swiperParams = {
        slidesPerView: "auto",
        freeMode: true,
        spaceBetween: 0,
        mousewheel: {
          forceToAxis: true,
        },
      };

      Object.assign(swiperRef.current, swiperParams);
      swiperRef.current.initialize();
    }
  }, []);

  const handleDepClick = (depValue: Department) => {
    dispatch(setDepartment(depValue));
    dispatch(fetchUsersThunk({ department: depValue }));
  };

  return (
    <StyledSwiperContainer ref={swiperRef} init="false">
      {Departments.map((dep) => (
        <StyledSwiperSlide key={dep} isActive={selectedDep === dep}>
          <Text onClick={() => handleDepClick(dep)}>
            {t(`departments.${dep}`)}
          </Text>
        </StyledSwiperSlide>
      ))}
    </StyledSwiperContainer>
  );
}

export default Selection;
