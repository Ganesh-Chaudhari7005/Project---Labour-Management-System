export function CreateUserId() {
  let UserID;
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let random_char_num = Math.floor(Math.random() * chars.length);
  let random_char_num2 = Math.floor(Math.random() * chars.length);
  let random_char2 = chars.charAt(random_char_num2);
  let random_char = chars.charAt(random_char_num);

  let random_num1 = Math.floor(Math.random() * 10);
  let random_num2 = Math.floor(Math.random() * 10);
  let random_num3 = Math.floor(Math.random() * 10);

  console.log(random_char);
  UserID = `U-${random_char}${random_char2}${random_num1}${random_num2}${random_num3}`;

  return UserID;
}

export function CreateAdminId() {
  let AdminID;
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let random_char_num = Math.floor(Math.random() * chars.length);
  let random_char_num2 = Math.floor(Math.random() * chars.length);
  let random_char2 = chars.charAt(random_char_num2);
  let random_char = chars.charAt(random_char_num);

  let random_num1 = Math.floor(Math.random() * 10);
  let random_num2 = Math.floor(Math.random() * 10);
  let random_num3 = Math.floor(Math.random() * 10);

  console.log(random_char);
  AdminID = `AD-${random_char}${random_char2}${random_num1}${random_num2}${random_num3}`;

  return AdminID;
}

export function CreateLabourId() {
  let LabourID;
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let random_char_num = Math.floor(Math.random() * chars.length);
  let random_char_num2 = Math.floor(Math.random() * chars.length);
  let random_char2 = chars.charAt(random_char_num2);
  let random_char = chars.charAt(random_char_num);

  let random_num1 = Math.floor(Math.random() * 10);
  let random_num2 = Math.floor(Math.random() * 10);
  let random_num3 = Math.floor(Math.random() * 10);

  console.log(random_char);
  LabourID = `LAB-${random_char}${random_char2}${random_num1}${random_num2}${random_num3}`;

  return LabourID;
}

export function CreateWageId() {
  let WageID;
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let random_char_num = Math.floor(Math.random() * chars.length);
  let random_char_num2 = Math.floor(Math.random() * chars.length);
  let random_char2 = chars.charAt(random_char_num2);
  let random_char = chars.charAt(random_char_num);

  let random_num1 = Math.floor(Math.random() * 10);
  let random_num2 = Math.floor(Math.random() * 10);
  let random_num3 = Math.floor(Math.random() * 10);

  WageID = `WAGE-${random_char}${random_char2}${random_num1}${random_num2}${random_num3}`;

  return WageID;
}

export function PasswordGenerator() {
  let Password;
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomSpChars = "!#$*{}[]@";
  let random_char_num = Math.floor(Math.random() * chars.length);
  let random_char_num2 = Math.floor(Math.random() * chars.length);
  let random_char2 = chars.charAt(random_char_num2);
  let random_char_num3 = Math.floor(Math.random() * chars.length);
  let random_char3 = chars.charAt(random_char_num3);
  let random_char = chars.charAt(random_char_num);

  let random_Spchar = Math.floor(Math.random() * randomSpChars.length);
  let random_Sp = randomSpChars.charAt(random_Spchar);

  let random_num1 = Math.floor(Math.random() * 10);
  let random_num2 = Math.floor(Math.random() * 10);
  let random_num3 = Math.floor(Math.random() * 10);

  Password = `${random_char}${random_char2}${random_Sp}${random_char3}${random_num1}${random_num2}${random_num3}`;

  return Password;
}
