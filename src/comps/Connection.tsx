import { connection } from "@/lib/shaka-ndn-plugin";
import React, { ReactNode, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button } from "@/components/ui/button";

interface ConnectionProps {
  children: ReactNode;
}

const Connection: React.FC<ConnectionProps> = ({ children }) => {
  const [hasRouterError, setHasRouterError] = useState<boolean | string>(false);
  const [hasRouterErrorConnection, setHasRouterErrorConnection] = useState<
    boolean | string
  >(false);
  const [getRouter, setGetRouter] = useState<null | string>(null);
  const [getConnection, setGetConnection] = useState<null | string>(null);

  const [loading, setLoading] = useState<boolean>(false);
  async function conn(): Promise<void> {
    setLoading(true);
    try {
      const response = await fetch("https://ndn-fch.named-data.net/");
      const result = await response.text();
      const url: string = `wss://${result}/ws/`;
      setGetRouter(result);
      try {
        const coon = await connection(url);
        setGetConnection(coon);
        setLoading(false);
        setHasRouterErrorConnection(false);
        setHasRouterError(false);
      } catch (error: unknown | any) {
        setHasRouterErrorConnection(error.message);
        setLoading(false);
      }
    } catch (error: unknown | any) {
      setHasRouterError(error.message);
    }
  }
  useEffect(() => {
    conn();
  }, []);
  return (
    <div className="container lg:px-2 my-4">
      <div className=" flex justify-between gap-4 my-3">
        <Alert className="lg:w-[50%] dark:bg-transparent text-md ">
          <AlertTitle>
            {loading && (
              <div className="loading">
                <h2 className="flex gap-4">
                  Searching for Router{" "}
                  <AiOutlineLoading3Quarters className="animate-spin" />
                </h2>
              </div>
            )}
            {hasRouterError && (
              <Alert variant="destructive" className="my-3 text-red-500">
                <AlertTitle>Unable to Locate Nearby Router</AlertTitle>
                <AlertDescription>
                  Please check your network connection.
                  <Button onClick={conn} className="block mt-4">
                    Reload Connection
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            {hasRouterErrorConnection && (
              <Alert variant="destructive" className="my-3 text-red-500">
                <AlertTitle>Network Error</AlertTitle>
                <AlertDescription>
                  Unable to establish a connection. Please check your network
                  settings.
                  <Button onClick={conn} className="block mt-4">
                    Reload Connection
                  </Button>
                </AlertDescription>
              </Alert>
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
          </AlertTitle>
        </Alert>
      </div>

      {children}
    </div>
  );
};

export default Connection;
