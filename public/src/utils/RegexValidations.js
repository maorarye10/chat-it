export const ValidEmail = new RegExp(
  "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
);
export const ValidPassword = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[0-9]).{6,}$"
);
