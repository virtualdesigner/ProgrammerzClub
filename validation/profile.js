const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = validateProfileInput = data => {
  const errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!Validator.isLength(data.handle, { min: 4, max: 30 })) {
    errors.handle = "Handle must be between 4 and 30 characters long";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle field is required";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Skills field is required";
  }

  if (!isEmpty(data.website) && !Validator.isURL(data.website)) {
    errors.website = "Invalid URL";
  }

  if (!isEmpty(data.youtube) && !Validator.isURL(data.youtube)) {
    errors.youtube = "Invalid URL";
  }

  if (!isEmpty(data.facebook) && !Validator.isURL(data.facebook)) {
    errors.facebook = "Invalid URL";
  }

  if (!isEmpty(data.twitter) && !Validator.isURL(data.twitter)) {
    errors.twitter = "Invalid URL";
  }

  if (!isEmpty(data.instagram) && !Validator.isURL(data.instagram)) {
    errors.instagram = "Invalid URL";
  }

  if (!isEmpty(data.linkedin) && !Validator.isURL(data.linkedin)) {
    errors.linkedin = "Invalid URL";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
