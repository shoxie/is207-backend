const validatePassword = (password) =>{
  const regrex = new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$")
  return regrex.test(password)
}
module.exports = {
  validatePassword,
};
