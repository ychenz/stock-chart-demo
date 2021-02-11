import React from "react";

import * as S from "./styles";

export function Loader(): React.ReactElement {
  return (
    <S.Root>
      <S.AnimatedCircle />
    </S.Root>
  );
}