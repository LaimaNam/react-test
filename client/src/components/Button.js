import React from 'react';
import styled from 'styled-components';

const ButtonStyled = styled.button``;

const Button = ({ text, action, color }) => {
  return (
    <ButtonStyled color={color} onClick={() => action()}>
      {text}
    </ButtonStyled>
  );
};

export default Button;
