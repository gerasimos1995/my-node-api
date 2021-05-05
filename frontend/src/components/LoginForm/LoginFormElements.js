import styled from "styled-components";
import { NavLink as LinkRouter } from "react-router-dom";

export const Container = styled.div`
  min-height: 857px;
  max-height: 857px;
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(
    90deg,
    rgba(1, 0, 19, 1) 0%,
    rgba(60, 165, 113, 1) 48%,
    rgba(23, 200, 113, 1) 65%
  );
`;

export const FormWrapper = styled.div`
  padding-top: 50px;
  padding-bottom: 50px;
  height: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-widith: 400px) {
    height: 80%;
  }
`;

export const FormContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width) {
    padding: 10px;
  }
`;

export const Form = styled.form`
  background: #010101;
  width: 650px;
  height: auto;
  z-index: 1;
  display: grid;
  margin: 0 auto;
  padding: 80px 32px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);

  @media screen and (max-width: 692px) {
    width: 300px;
  }

  @media screen and (max-width: 400px) {
    padding: 32px 32px;
  }
`;

export const FormH1 = styled.h1`
  margin-bottom: 40px;
  color: #fff;
  font-size: 20px;
  font-weight: 400;
  text-align: center;
`;

export const FormLabel = styled.label`
  margin-bottom: 8px;
  font-size: 14px;
  color: #fff;
`;

export const FormInput = styled.input`
  padding: 16px 16px;
  margin-bottom: 32px;
  border: none;
  border-radius: 4px;
`;

export const FormButton = styled.button`
  background: #3ca571;
  padding: 16px 0;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
`;

export const BtnLink = styled(LinkRouter)`
  color: #3ca571;
  padding: 0 1rem;
  cursor: pointer;

  &:hover {
    color: #3ca571;
  }
`;
