export function CreateUserId() {
  let UserID;
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let numbers = "0123456789";

  let random_char_num = Math.floor(Math.random()*chars.length);
  let random_char = chars.charAt(random_char_num);

  let random_num1 = Math.floor(Math.random() * 10);
  let random_num2 = Math.floor(Math.random() * 10);
  let random_num3 = Math.floor(Math.random() * 10);

  console.log(random_char);
  UserID = `U-${random_char}${random_num1}${random_num2}${random_num3}`;
  
  return UserID;
  
}


export function CreateAdminId() {
  let AdminID;
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let numbers = "0123456789";

  let random_char_num = Math.floor(Math.random() * chars.length);
  let random_char = chars.charAt(random_char_num);

  let random_num1 = Math.floor(Math.random() * 10);
  let random_num2 = Math.floor(Math.random() * 10);
  let random_num3 = Math.floor(Math.random() * 10);

  console.log(random_char);
  AdminID = `AD-${random_char}${random_num1}${random_num2}${random_num3}`;

  return AdminID;
}
