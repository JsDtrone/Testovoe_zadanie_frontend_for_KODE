import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSortBy, selectSortBy } from "../userSlice";
import { type SortType } from "../types";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${(props) => props.theme.overlay};
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: ${keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`} 0.2s ease-out;

  @media (max-width: 768px) {
    align-items: flex-end;
    padding: 0px;
  }
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 375px;
  border-radius: 20px;
  padding: 24px;
  position: relative;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  background-color: ${(props) => props.theme.surface};

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 10px 24px 40px 24px;
    border-radius: 20px 20px 0 0;
    animation: ${keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`} 0.25s cubic-bezier(0.1, 0.76, 0.55, 0.94);
  }
`;

const DragHandle = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 56px;
    height: 4px;
    background-color: ${(props) => props.theme.divider};
    border-radius: 2px;
    margin: 0px auto 24px auto;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  color: ${(props) => props.theme.text};
  margin: 0px;
`;

const OptionRow = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.text};
  &:last-child {
    margin-bottom: 0px;
  }
`;

interface RadioCircleProps {
  isChecked: boolean;
}

const RadioCircle = styled.div<RadioCircleProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-right: 15px;

  border-radius: 100%;
  border: 2px solid ${(props) => props.theme.accent};

  background-color: transparent;
  transition: all 0.1s ease;
`;

const RadioDot = styled.div<{ isChecked: boolean }>`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: #ffffff;
  border: 6px solid ${(props) => props.theme.accent};

  display: ${(props) => (props.isChecked ? "block" : "none")};
`;

const HiddenInput = styled.input`
  display: none;
`;

interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SortModal: React.FC<SortModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentSort = useAppSelector(selectSortBy);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSortChange = (type: SortType) => {
    dispatch(setSortBy(type));
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContent>
        <DragHandle />
        <HeaderWrapper>
          <Title>{t("sort.title")}</Title>
        </HeaderWrapper>

        <div>
          <OptionRow>
            <HiddenInput
              type="radio"
              name="sort"
              checked={currentSort === "alphabet"}
              onChange={() => handleSortChange("alphabet")}
            />
            <RadioCircle isChecked={currentSort === "alphabet"}>
              <RadioDot isChecked={currentSort === "alphabet"} />
            </RadioCircle>
            {t("sort.alphabet")}
          </OptionRow>

          <OptionRow>
            <HiddenInput
              type="radio"
              name="sort"
              checked={currentSort === "birthday"}
              onChange={() => handleSortChange("birthday")}
            />
            <RadioCircle isChecked={currentSort === "birthday"}>
              <RadioDot isChecked={currentSort === "birthday"} />
            </RadioCircle>
            {t("sort.birthday")}
          </OptionRow>
        </div>
      </ModalContent>
    </Overlay>
  );
};
