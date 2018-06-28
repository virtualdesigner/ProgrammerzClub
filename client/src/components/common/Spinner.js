import React from "react";
import loading_ripple from "./loading_ripple.gif";
import loading_eclipse from "./eclipse_spinner.svg";

export default () => {
  return (
    <div>
      <img
        src={loading_eclipse}
        alt="Loading..."
        style={{ width: "100px", margin: "auto", display: "block" }}
      />
    </div>
  );
};
