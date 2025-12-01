import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Verify = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/user/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setStatus("✅ Your Email has been Verified");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setStatus("❌ Invalid or expired token. Please try again.");
        }
      } catch (error) {
        console.log(error);
        setStatus("❌ Verification failed. Please try again.");
      }
    };

    verifyEmail();
  }, [navigate, token]);

  return (
    <div className="relative w-full h-[760px] overflow-hidden">
      <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">{status}</h2>
          <p className="text-gray-400 text-sm">
            If your email is verified successfully, you will be redirected to
            the login page shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
