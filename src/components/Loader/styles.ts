import styled, { keyframes } from "styled-components";

const Loader = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Root = Loader;

export const LoaderKeyframe = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const AnimatedCircle = styled.div`
  border: 2px solid black;
  border-bottom: 2px solid transparent;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: ${LoaderKeyframe} 1s linear infinite;
`;