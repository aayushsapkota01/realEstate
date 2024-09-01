import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import useAutoClearError from "../redux/useAutoClearError";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useAutoClearError(error);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto py-20">
      <h1 className="text-3xl text-center font-semibold my-7 text-blue-900">
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg border-slate-400"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg border-slate-400"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          // className="bg-blue-700 text-white p-3 uppercase rounded-lg hover:opacity-85"
          className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg p-3 uppercase"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700 hover:underline hover:text-blue-900 transition duration-500 hover:underline-offset-4 cursor-pointer">Sign Up</span>
        </Link>
      </div>
      {/* {error && <p className="text-red-500 mt-5">{error}</p>} */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-5"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
};

export default SignIn;
