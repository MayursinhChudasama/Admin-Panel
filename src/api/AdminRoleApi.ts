import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URL } from "../common/constant";
import Cookies from "js-cookie";
// import { useLogout } from "../hooks/useLogout.jsx";

const useCreateAdminRole = () => {
  // const { logout } = useLogout();
  const createAdminRole = async (roleData: any) => {
    const adminKey = process.env.REACT_APP_ADMIN_KEY;
    if (!adminKey) {
      throw new Error("REACT_APP_ADMIN_KEY environment variable is not set");
    }

    const response = await fetch(`${API_URL}/role/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "admin-key": adminKey,
        Authorization: `Bearer ${Cookies.get("A_accessToken")}`,
      },
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // await logout();
        return;
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create Admin Role");
    }

    return response.json();
  };

  return useMutation({
    mutationFn: createAdminRole,
    onError: (error: Error) => {
      console.error("Error Creating Admin Role:", error.message);
    },
    onSuccess: (data: any) => {
      console.log("Admin Role Created Successfully:", data);
      // Additional success handling can be done here
    },
  });
};

const useFetchAdminRoles = () => {
  // const { logout } = useLogout();
  const getUsersAdminData = async () => {
    const adminKey = process.env.REACT_APP_ADMIN_KEY;
    if (!adminKey) {
      throw new Error("REACT_APP_ADMIN_KEY environment variable is not set");
    }

    const response = await fetch(`${API_URL}/role`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "admin-key": adminKey,
        Authorization: `Bearer ${Cookies.get("A_accessToken")}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // await logout();
        return;
      }
      throw new Error("Failed to fetch admin role");
    }

    return response.json();
  };

  const {
    data: AdminRole,
    isLoading,
    error,
  } = useQuery<unknown, Error>({
    queryKey: ["fetchAdminRole"],
    queryFn: getUsersAdminData,
  });

  // Handle error using the error from useQuery return value
  useEffect(() => {
    if (error) {
      console.error("Error fetching admin role:", error.message);
    }
  }, [error]);

  return { AdminRole, isLoading, error };
};

const useFetchAdminRolesById = (id: string) => {
  // const { logout } = useLogout();
  const getUsersAdminDataById = async () => {
    const adminKey = process.env.REACT_APP_ADMIN_KEY;
    if (!adminKey) {
      throw new Error("REACT_APP_ADMIN_KEY environment variable is not set");
    }

    const response = await fetch(`${API_URL}/role/get/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "admin-key": adminKey,
        Authorization: `Bearer ${Cookies.get("A_accessToken")}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // await logout();
        return;
      }
      throw new Error("Failed to fetch admin role by id");
    }

    return response.json();
  };

  const {
    data: AdminRoleById,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fetchAdminRoleById", id],
    queryFn: getUsersAdminDataById,
    enabled: !!id, // Only run the query if id is available
  });

  if (error) {
    console.error("Error fetching admin role by id:", error.message);
  }

  return { AdminRoleById, isLoading, error };
};

const useDeleteAdminRolesById = () => {
  // const { logout } = useLogout();
  const deleteAdminDataById = async (id: string) => {
    const adminKey = process.env.REACT_APP_ADMIN_KEY;
    if (!adminKey) {
      throw new Error("REACT_APP_ADMIN_KEY environment variable is not set");
    }

    const response = await fetch(`${API_URL}/role/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "admin-key": adminKey,
        Authorization: `Bearer ${Cookies.get("A_accessToken")}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // await logout();
        return;
      }
      throw new Error("Failed to delete admin role by id");
    }

    return response.json();
  };

  return deleteAdminDataById;
};

const useUpdateAdminRole = () => {
  // const { logout } = useLogout();
  const updateAdminRole = async (roleData: any) => {
    const adminKey = process.env.REACT_APP_ADMIN_KEY;
    if (!adminKey) {
      throw new Error("REACT_APP_ADMIN_KEY environment variable is not set");
    }

    const response = await fetch(`${API_URL}/role/update/${roleData.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "admin-key": adminKey,
        Authorization: `Bearer ${Cookies.get("A_accessToken")}`,
      },
      body: JSON.stringify(roleData), // Send the role data from the form
    });

    if (!response.ok) {
      if (response.status === 401) {
        // await logout();
        return;
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create Admin Role");
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: updateAdminRole,
    onError: (error: Error) => {
      console.error("Error updating Admin Role:", error.message);
    },
    onSuccess: (data: any) => {
      console.log("Admin Role updated Successfully:", data);
      // You can add success handling here (e.g., redirect, toast notification)
    },
  });

  return mutation;
};

export {
  useCreateAdminRole,
  useFetchAdminRoles,
  useFetchAdminRolesById,
  useUpdateAdminRole,
  useDeleteAdminRolesById,
};
