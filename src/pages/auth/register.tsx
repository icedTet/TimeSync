import { useCallback, useEffect, useState } from "react";
import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { User } from "../../utils/types/user";
import { RegisterResultResponse } from "../api/auth/register";
import Link from "next/link";
const register = async (user: Partial<User>) => {
  // register the user with the server
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user }),
  });
  // let status = await response.status;
  if (~~(response.status / 100) === 5) {
    return null;
  }
  let data = await response.json();
  return data as RegisterResultResponse;
};
export const Register = () => {
  // create a register form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const verifyForm = useCallback(() => {
    // Check if all fields are filled out
    if (!email) {
      setError("Missing email");
      return false;
    }
    if (!username) {
      setError("Missing username");
      return false;
    }
    if (!firstName) {
      setError("Missing first name");
      return false;
    }
    if (!lastName) {
      setError("Missing last name");
      return false;
    }
    if (!password) {
      setError("Missing password");
      return false;
    }
    if (confirmPassword !== password) {
      setError("Passwords do not match");
      return false;
    }
    if (!email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
      setError("Invalid email");
      return false;
    }
    if (!username.match(/^[a-zA-Z0-9_.+-]+$/)) {
      setError(
        "Invalid username, only alphanumeric characters, underscores, and dashes are allowed"
      );
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    // everything is good, proceed to register with server
    if (loading) return;
    setLoading(true);
    register({ username, email, password, firstName, lastName }).then(
      (response) => {
        setLoading(false);
        if (!response) return null;
        if (!response.success) {
          setError((response as any).error);
        } else {
          setSuccess(true);
        }
      }
    );
  }, [
    email,
    firstName,
    lastName,
    username,
    password,
    confirmPassword,
    loading,
  ]);
  useEffect(() => {
    setError("");
  }, [firstName, lastName, username, email, password, confirmPassword]);

  return (
    <div className="w-full min-h-screen relative">
      {success ? (
        <div
          className={`max-w-[90%] w-[45ch] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 z-10 rounded-3xl shadow-lg p-10`}
        >
          <div className="flex flex-col gap-8">
            <h1 className="font-poppins text-2xl font-semibold text-gray-700 pb-4">
              One more thing!
            </h1>
            <div className="flex flex-row gap-2 items-center justify-center w-full">
              <div className="bg-gray-200 rounded-full flex items-center justify-center p-8">
                <EnvelopeIcon className="w-12 h-12 text-rose-800 stroke-2" />
              </div>
            </div>
            <p className="font-wsans leading-snug text-gray-600">
              We've sent you an email to verify your account. Please check your
              inbox and click the link to verify your account.
            </p>
          </div>
        </div>
      ) : (
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
              <p className="font-wsans text-sm leading-4 font-medium">
                {error}
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <input
                type="text"
                placeholder="First Name"
                className="basicinput"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="basicinput"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
              />
            </div>
            <input
              type="text"
              placeholder="Username"
              className="basicinput"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Email"
              className="basicinput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <div className="flex flex-col gap-4">
              <input
                type={"password"}
                placeholder="Password"
                className="basicinput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <input
                type={"password"}
                placeholder="Confirm Password"
                className="basicinput"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              className={`btn-primary mt-4 disabled:opacity-50`}
              onClick={verifyForm}
              disabled={loading}
            >
              Create Account
            </button>
            <div className="flex flex-row gap-1 opacity-50 text-sm">
              Already have an account?
              <Link href="/auth/login">Login</Link>
            </div>
          </div>
        </div>
      )}
      <div
        className={`w-full h-full absolute top-0 left-0 meshy opacity-10 z-0`}
      />
    </div>
  );
};

export default Register;
