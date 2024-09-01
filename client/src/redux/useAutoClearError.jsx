import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearError } from "../redux/user/userSlice";

const useAutoClearError = (error, delay = 2000) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        dispatch(clearError());
      }, delay);

      return () => clearTimeout(timeout); // Cleanup the timeout if the component unmounts or error changes
    }
  }, [error, dispatch, delay]);
};

export default useAutoClearError;
