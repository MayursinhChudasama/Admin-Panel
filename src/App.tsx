import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./pages/MainLayout";

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
