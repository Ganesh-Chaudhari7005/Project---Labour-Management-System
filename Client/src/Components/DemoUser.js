const UserAllDetails = {
  get Name() {
    return sessionStorage.getItem("UserName");
  },
  get Email() {
    return sessionStorage.getItem("UserEmail");
  },
  get Role() {
    return sessionStorage.getItem("UserRole");
  },
  get Phone() {
    return sessionStorage.getItem("Phone");
  },
  get Address() {
    return sessionStorage.getItem("Address");
  },
  get ProfilePic() {
    return sessionStorage.getItem("UserImgPath");
  },
};

export default UserAllDetails;
