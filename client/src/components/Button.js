import React from 'react';
import styled from 'styled-components';

const ButtonStyled = styled.button`
  background-color: ${(props) => (props.primary ? 'lawgreen' : 'lightgrey')};
`;

const Button = ({ text, action, primary, secondary }) => {
  return (
    <ButtonStyled
      primary={primary}
      secondary={secondary}
      onClick={(e) => action(e)}
    >
      {text}
    </ButtonStyled>
  );
};

export default Button;
