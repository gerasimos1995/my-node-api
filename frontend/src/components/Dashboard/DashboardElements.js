import styled from "styled-components";

export const DashboardContainer = styled.div`
  height: 857px;
  background: #010606;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 1000px) {
    height: 1200px;
  }

  @media screen and (max-width: 768px) {
    height: 2300px;
  }

  @media screen and (max-width: 480px) {
    height: 2300px;
  }
`;

export const DashboardWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  grid-gap: 5rem;
  padding: 0 50px;

  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }
`;

export const DashboardItem = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 15px;
  padding: 30px;
  transition: all 0.8s ease-in-out;
  min-height: 300px;
  max-height: 300px;
  z-index: 1;

  &:hover {
    transform: scale(1.15);
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    box-shadow: 0 0 35px rgba(60, 165, 113);
  }
`;

export const ItemIcon = styled.img`
  min-heigh: 150px;
  max-height: 150px;
  min-width: 150px;
  max-width: 150px;
  margin-top: 5px;
`;

export const ItemH1 = styled.h1`
  font-size: 2.5rem;
  color: #555;
  margin-bottom: 32px;
  margin-top: 16px;
`;
