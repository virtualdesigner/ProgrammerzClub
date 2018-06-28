const isEmpty = data =>
  data === undefined ||
  data === null ||
  (typeof data === "string" && data.trim().length === 0) ||
  (typeof data === "object" && Object.keys(data).length === 0);

module.exports = isEmpty;
