import { API } from "@/App";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { CheckCircle, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API}/user/forgot-password`,
        { email }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate(`/verify-otp/${email}`);
      } else {
        setError(res.data.message || "Something went wrong");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send reset email. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full relative h-[700px] bg-green-100 overflow-hidden">
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-green-600">
                Reset Password
              </h1>
              <p className="text-muted-foreground">
                Enter your email and we’ll send you a link to reset your
                password.
              </p>
            </div>

            <Card className="p-6 bg-white">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-green-600 mb-4 text-center">
                  Forgot Password
                </CardTitle>

                <CardDescription className="text-center">
                  {isSubmitted
                    ? `Check your email for a reset link.`
                    : `Enter your email to receive a password reset link.`}
                </CardDescription>

                <CardDescription className="space-y-2">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {isSubmitted ? (
                    <div className="py-6 flex flex-col items-center text-center space-y-4">
                      <div className="bg-primary/10 rounded-full p-3">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>

                      <h3 className="text-lg font-medium text-green-600">
                        Email Sent Successfully
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        We sent a password reset link to{" "}
                        <span className="font-medium text-foreground">
                          {email}
                        </span>
                        .
                      </p>

                      <p>If you don’t see it, check your spam folder.</p>

                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setEmail("");
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                      >
                        Back
                      </button>
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="space-y-2 text-gray-800">
                        <label>Email</label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isLoading}
                          className="w-full border p-2 rounded-md"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-green-600 text-white hover:bg-green-500"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Reset Link"
                        )}
                      </Button>
                    </form>
                  )}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex justify-center">
                <p>
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-green-600 hover:underline font-medium"
                  >
                    Sign In
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
