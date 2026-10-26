import "./App.css";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "sonner";
import { useTheme } from "./context/ThemeContext";

function App() {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <AppRoutes />
      <Toaster theme={resolvedTheme} />
    </>
  );
}

export default App;
