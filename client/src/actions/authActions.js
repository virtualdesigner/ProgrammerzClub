import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import axios from "axios";
import jwt_decode from "jwt-decode";

import setAuthToken from "../utils/setAuthToken";

export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(errors =>
      dispatch({
        type: GET_ERRORS,
        payload: errors.response.data
      })
    );
};

export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      const { token } = res.data;
      // Add token to the local storage
      localStorage.setItem("jwtToken", token);

      // Set Token to axios Header
      setAuthToken(token);

      // Decode token to get user data
      const decoded = jwt_decode(token);

      dispatch(setCurrentUser(decoded));
    })
    .catch(errors =>
      dispatch({
        type: GET_ERRORS,
        payload: errors.response.data
      })
    );
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const logoutUser = () => dispatch => {
  // Delete the token in LocalStorage
  localStorage.removeItem("jwtToken");

  // Delete the 'Authorization' header by sending 'false' to setAuthToken()
  setAuthToken(false);

  // Blank the user to an empty object - {}
  dispatch(setCurrentUser({}));
};
