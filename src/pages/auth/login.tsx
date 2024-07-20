import { useCallback, useEffect, useState } from "react";
import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { User } from "../../utils/types/user";
import { RegisterResultResponse } from "../api/auth/register";
import { useRouter } from "next/router";
import { LoginResultResponse } from "../api/auth/login";
import Link from "next/link";
import { SelfUserClass } from "../../utils/classes/UserClass";
const login = async (email: string, password: string) => {
  // register the user with the server
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  // let status = await response.status;
  if (~~(response.status / 100) === 5) {
    return null;
  }
  let data = await response.json();
  return data as LoginResultResponse;
};
export const Register = () => {
  // create a register form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const verifyForm = useCallback(() => {
    // Check if all fields are filled out
    if (!email) {
      setError("Missing email");
      return false;
    }
    if (!password) {
      setError("Missing password");
      return false;
    }
    if (!email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
      setError("Invalid email");
      return false;
    }
    // everything is good, proceed to register with server
    if (loading) return;
    setLoading(true);
    login(email, password).then((response) => {
      setLoading(false);
      if (!response) return null;
      if (!response.success) {
        setError(response.message);
      } else {
        setSuccess(true);
        localStorage.setItem("token", response.token!);
        SelfUserClass.getInstance().fetchUser();
        router.push("/dashboard");
      }
    });
  }, [email, password, loading]);
  useEffect(() => {
    setError("");
  }, [email, password]);

  return (
    <div className="w-full min-h-screen relative">
      <div
        className={`max-w-[90%] w-[45ch] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 z-10 rounded-3xl shadow-lg p-10`}
      >
        <div className="flex flex-col gap-4">
          <h1 className="font-poppins text-xl font-semibold text-gray-700 pb-4">
            Create an Account
          </h1>
          <div
            className={`bg-red-800/10 p-4 rounded-2xl flex flex-row gap-4 text-red-900 items-center ${
              error ? `block` : `hidden`
            } overflow-hidden transition-all duration-300`}
          >
            <ExclamationTriangleIcon className="h-6 w-6 leading-4" />
            <p className="font-wsans text-sm leading-4 font-medium">{error}</p>
          </div>
          <input
            type="email"
            placeholder="Email"
            className="basicinput"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type={"password"}
            placeholder="Password"
            className="basicinput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button
            className={`btn-primary mt-4 disabled:opacity-50`}
            onClick={verifyForm}
            disabled={loading}
          >
            Login
          </button>
          <div className="flex flex-row gap-1 opacity-50 text-sm">
            Don't have an account?
            <Link href="/auth/register">Register</Link>
          </div>
        </div>
      </div>
      <div
        className={`w-full h-full absolute top-0 left-0 meshy opacity-10 z-0`}
      />
    </div>
  );
};

export default Register;
