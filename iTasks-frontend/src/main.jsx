import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import "./index.css";
import App from "./App.jsx";
import ContextProvider from "./context/Context.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CookiesProvider>
      <ContextProvider>
        <App />
      </ContextProvider>
    </CookiesProvider>
  </StrictMode>
);
