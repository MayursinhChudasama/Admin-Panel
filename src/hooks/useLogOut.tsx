import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
  };

  return { logout };
};
