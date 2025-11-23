import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure there's a <div id='root'></div> in your HTML.");
}

try {
  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error("Failed to render app:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: system-ui; max-width: 600px; margin: 50px auto;">
      <h1 style="color: #dc2626;">Application Error</h1>
      <p>Failed to start the application. Please check the browser console for details.</p>
      <pre style="background: #f3f4f6; padding: 15px; border-radius: 8px; overflow-x: auto;">
${error instanceof Error ? error.message : String(error)}
      </pre>
      <p style="margin-top: 20px;">
        <strong>Common fixes:</strong><br>
        1. Check browser console for errors<br>
        2. Verify environment variables are set<br>
        3. Try refreshing the page<br>
        4. Clear browser cache
      </p>
    </div>
  `;
}
