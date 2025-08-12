import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import Orders from "./pages/Orders";
import LogIn from "./pages/LogIn";

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <LogIn /> },
        { path: "orders", element: <Orders /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
