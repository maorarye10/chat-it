module.exports.ValidEmail = new RegExp(
  "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
);
module.exports.ValidPassword = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*[0-9]).{6,}$"
);
