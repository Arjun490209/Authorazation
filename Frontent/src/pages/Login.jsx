import React from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getData } from '../context/userContext'
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { API } from "@/App";

const Login = () => {
  const {setUser} = getData()
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API}/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUser(response.data.data);
        localStorage.setItem("accessToken", response.data.accessToken);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl border border-green-200 animate-fadeIn">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-700">
            Login to Your Account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Login into account to get started Notes App.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="rounded-md focus:ring-2 focus:ring-green-400 focus:border-none focus:outline-none  pr-10"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-green-700 font-medium hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  required
                  className="rounded-md focus:ring-2 focus:ring-green-400 focus:border-none focus:outline-none pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-green-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              Create an account?
              <Link
                to="/signup"
                className="text-green-700 font-medium hover:underline ml-1"
              >
                Signup
              </Link>
            </p>

            {/* 👉 Button moved inside form */}
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3"></CardFooter>
      </Card>
    </div>
  );
};

export default Login;

{
  /* <div className="flex items-center w-full gap-3"> <span className="h-px w-full bg-gray-300" /> <span className="text-sm text-gray-500">OR</span> <span className="h-px w-full bg-gray-300" /> </div> */
  /* <Button variant="outline" className="w-full rounded-md border-green-400 hover:bg-green-50" > Continue with Google </Button> */
}
