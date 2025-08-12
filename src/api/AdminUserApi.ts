import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URL } from "../common/constant.js";
import Cookies from "js-cookie";
import { useLogout } from "../hooks/useLogOut";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const useFetchAdminUsers = () => {
  const { logout } = useLogout();
  const getUsersAdminData = async (): Promise<AdminUser[]> => {
    const adminKey = process.env.REACT_APP_ADMIN_KEY;
    if (!adminKey) {
      throw new Error("REACT_APP_ADMIN_KEY environment variable is not set");
    }

    const response = await fetch(`${API_URL}/admin/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "admin-key": adminKey,
        Authorization: `Bearer ${Cookies.get("A_accessToken")}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        await logout();
        return [];
      }
      throw new Error("Failed to fetch admin user users data");
    }
    return response.json();
  };

  const {
    data: Adminusers,
    isLoading,
    error: ErrorInAdmin,
  } = useQuery<AdminUser[], Error>({
    queryKey: ["fetchAdminUsers"],
    queryFn: getUsersAdminData,
  });

  return { Adminusers, isLoading, ErrorInAdmin };
};

const useFetchAdminUserById = (id: string) => {
  const { logout } = useLogout();
  const getUsersAdminData = async (): Promise<AdminUser> => {
    const adminKey = process.env.REACT_APP_ADMIN_KEY;
    if (!adminKey) {
      throw new Error("REACT_APP_ADMIN_KEY environment variable is not set");
    }

    const response = await fetch(`${API_URL}/admin/admin/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "admin-key": adminKey,
        Authorization: `Bearer ${Cookies.get("A_accessToken")}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        await logout();
        return {
          id: "undefined as string",
          name: "undefined as string",
          email: "undefined as string",
          role: "undefined as string",
        };
      }
      throw new Error("Failed to fetch Admin Users data");
    }

    return response.json();
  };

  const {
    data: Adminusers,
    isLoading,
    error,
  } = useQuery<AdminUser, Error>({
    queryKey: ["fetchUsersAdminData", id],
    queryFn: getUsersAdminData,
  });

  return { Adminusers, isLoading, error };
};

const deleteUser = async (logout: () => void, id: string, adminKey: string) => {
  if (!adminKey) {
    throw new Error("REACT_APP_ADMIN_KEY environment variable is not set");
  }

  try {
    const xApiKey = process.env.REACT_APP_X_API_KEY;
    console.log(`Deleting user with id ${id}`); // Log the user ID

    // Create headers object with required headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "admin-key": adminKey,
      Authorization: `Bearer ${Cookies.get("A_accessToken")}`,
    };

    // Only add api-key if it's defined
    if (xApiKey) {
      headers["api-key"] = xApiKey;
    }

    const response = await fetch(`${API_URL}/admin/delete/${id}`, {
      method: "DELETE",
      headers,
    });

    console.log(`Response status: ${response.status}`); // Log the response status
    console.log(`Response headers: ${JSON.stringify(response.headers)}`); // Log the response headers

    if (!response.ok) {
      if (response.status === 401) {
        await logout();
        return;
      }
      const errorText = await response.text(); // Capture the error response
      console.error(`Failed to delete user with id ${id}:`, errorText); // Log the error response
      throw new Error("Failed to delete user");
    }

    console.log(`Deleted user with id ${id}`); // Log that the user was deleted
    return response.json();
  } catch (error) {
    console.error("Error in deleteUser function:", error); // Log any caught errors
    throw error;
  }
};

const useDeleteAdminUserById = () => {
  const { logout } = useLogout();
  const adminKey = process.env.REACT_APP_ADMIN_KEY;

  const {
    mutate: deleteAdminUserMutation,
    isPending: isDeleting,
    error,
  } = useMutation({
    mutationFn: (id: string) => {
      if (!adminKey) {
        throw new Error("Admin key is not available");
      }
      return deleteUser(logout, id, adminKey);
    },
    onError: (error: Error) => {
      console.error("Error deleting user:", error.message);
    },
  });

  return { deleteAdminUserMutation, isDeleting, error };
};

type UpdateAdminUserArgs = {
  id: string;
  AdminusersData: Partial<AdminUser>;
};

const useUpdateAdminUser = () => {
  const { logout } = useLogout();
  const updateUser = async ({ id, AdminusersData }: UpdateAdminUserArgs) => {
    const adminKey = process.env.REACT_APP_ADMIN_KEY;
    console.log("Admin Key:", adminKey);
    if (!adminKey) {
      throw new Error("REACT_APP_ADMIN_KEY environment variable is not set");
    }
    const response = await fetch(`${API_URL}/admin/update/${id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "admin-key": adminKey,
        Authorization: `Bearer ${Cookies.get("A_accessToken")}`,
      },
      body: JSON.stringify(AdminusersData),
      credentials: "include", // or 'same-origin' depending on your setup
    });

    if (!response.ok) {
      if (response.status === 401) {
        await logout();
        return;
      }
      const errorData = await response.json();
      throw new Error(errorData.data || "Failed to update Admin data");
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: updateUser,
    onError: (error: Error) => {
      console.error("Error updating Admin:", error.message);
      // You can also log more details if needed
      console.error("Full Error:", error);
    },
  });

  return mutation;
};

const useAddAdmin = () => {
  const { logout } = useLogout();
  const addAdmin = async (adminData: AdminUser) => {
    const adminKey = process.env.REACT_APP_ADMIN_KEY;
    if (!adminKey) {
      throw new Error("REACT_APP_ADMIN_KEY environment variable is not set");
    }

    const response = await fetch(`${API_URL}/admin/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "admin-key": adminKey,
        Authorization: `Bearer ${Cookies.get("A_accessToken")}`,
      },
      body: JSON.stringify(adminData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        await logout();
        return;
      }
      const errorData = await response.json();
      throw new Error(errorData.data || "Failed to add admin data");
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: addAdmin,
    onError: (error: Error) => {
      console.error("Error adding admin:", error.message);
    },
  });
  return mutation;
};

export {
  useFetchAdminUsers,
  useDeleteAdminUserById,
  useUpdateAdminUser,
  useFetchAdminUserById,
  useAddAdmin,
};
