import React, {useEffect, useState} from "react";
import axios from "axios";

function VerifyEmail() {
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const email = queryParams.get("email");

    if (!token || !email) {
      setMessage("Invalid verification link");
      return;
    }

    axios
        .get(`http://localhost:5000/verify-email?token=${token}&email=${email}`)
        .then((res) => {
          setMessage(res.data || "Email verified successfully!");
        })
        .catch((err) => {
          console.error(err);
          setMessage("Verification failed. This link may have expired or is invalid.");
        });
  }, []);

  return (
    <div style={{textAlign: "center", paddingTop: "80px"}}>
      <h2>{message}</h2>
    </div>
  );
}

export default VerifyEmail;
