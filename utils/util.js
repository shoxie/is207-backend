function checkTargetIfBLank(key) {
  if (key.length === undefined) return true;
  else return false;
}

function checkBLank(data) {
  for (key of data) {
    if (key.length === undefined || key.length === 0) {
      return `${key} is blank`;
    }
  }
  false;
}
module.exports = {
  checkBLank,
  checkTargetIfBLank
};
