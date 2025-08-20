const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
  return passwordRegex.test(password);
};

const isValidName = (name) => {
  return name.length >= 20 && name.length <= 60;
};

const isValidAddress = (address) => {
  return address.length <= 400;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidAddress
};