import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import useAutoClearError from "../redux/useAutoClearError";
import { signInFailure } from "../redux/user/userSlice"; // Import the relevant action

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const error = useSelector((state) => state.user.error); // Use the Redux state for error

  useAutoClearError(error); // Utilize the custom hook to auto-clear the error

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        dispatch(signInFailure(data.message)); // Dispatch Redux action for error
        return;
      }

      setLoading(false);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      dispatch(signInFailure(error.message)); // Dispatch Redux action for error
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto py-20">
      <h1 className="text-3xl text-center font-semibold my-7 text-blue-900">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg border-slate-400"
          id="username"
          onChange={handleChange}
        />
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
          className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg p-3 uppercase"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700 hover:underline hover:text-blue-900 transition duration-500 hover:underline-offset-4 cursor-pointer">Sign In</span>
        </Link>
      </div>
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

export default SignUp;
