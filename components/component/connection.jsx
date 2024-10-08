import { CardTitle, CardContent, Card } from "@/components/ui/card";
import { connection } from "@/ndn/ndn-shaka-plugin";
import { useState, useEffect } from "react";
export function Connection() {
  // State variables for managing errors, router, and connection
  const [hasRouterError, setHasRouterError] = useState(false);
  const [hasRouterErrorConnection, setHasRouterErrorConnection] =
    useState(false);
  const [getRouter, setGetRouter] = useState("");
  const [getConnection, setGetConnection] = useState("");

  // State variable for managing loading state
  const [loading, setLoading] = useState(false);

  // Asynchronous function to establish a connection
  async function conn() {
    setLoading(true);

    try {
      // Fetch the router URL
      const response = await fetch("https://ndn-fch.named-data.net/");
      const result = await response.text();
      const url = `wss://${result}/ws/`;
      // const url = `ws://localhost:9696/ws/`;

      // Update the router state
      setGetRouter(url);

      try {
        // Establish the connection
        const coon = await connection(url);
        setGetConnection(coon);

        // Update the error and loading states
        setLoading(false);
        setHasRouterErrorConnection(false);
        setHasRouterError(false);
      } catch (error) {
        // Handle connection error
        setHasRouterErrorConnection(error.message);
        setLoading(false);
        setHasRouterError(true);
      }
    } catch (error) {
      // Handle router fetch error
      setHasRouterError(error.message);
    }
  }
  useEffect(() => {
    conn();
  }, []);
  return (
    <Card className="w-full  max-w-xl mx-auto">
      <div className="flex items-center justify-between p-4">
        <CardTitle className="text-xl">Connection Check</CardTitle>
        <div className="relative">
          <div
            className={`h-5 w-5 rounded-full ${
              hasRouterError ? "bg-red-600" : "bg-green-500"
            }   animate-bounce`}
          />
          <div
            className={`absolute top-0 left-0 h-5 w-5 rounded-full${
              hasRouterError ? "bg-red-500" : "bg-green-500"
            }`}
          />
        </div>
      </div>
      <CardContent className="flex items-center justify-center gap-4 py-1">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <NetworkIcon
            className={`h-6 w-6  ${
              loading ? "animate-spin" : ""
            } text-gray-500 dark:text-gray-400`}
          />
        </div>
        {loading && (
          <>
            <h2 className="flex gap-4">Searching for Router... </h2>
          </>
        )}
        {getRouter && (
          <div className="getRouter py-4">
            <div>
              {getConnection ? (
                <>
                  <h2>Connection Successful</h2>
                  <h3 className="py-3">
                    Router Connected :{" "}
                    <span className="lg:inline lg:py-0 block py-3">
                      {getRouter}
                    </span>
                  </h3>
                </>
              ) : (
                <>
                  <span>Router Acquired </span>
                </>
              )}
            </div>
          </div>
        )}
        {/* <p className="text-lg font-medium">Checking connection...</p> */}
      </CardContent>
    </Card>
  );
}

function NetworkIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      <path d="M12 12V8" />
    </svg>
  );
}
