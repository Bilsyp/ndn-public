import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

import React, { ReactNode } from "react";
interface ConnectionProps {
  children: ReactNode;
}
const Skeletons: React.FC<ConnectionProps> = ({ children }) => {
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulasi waktu muat data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      {isLoading ? (
        // Skeleton loading effect
        <Skeleton className="my-5   py-4  h-auto rounded-full" />
      ) : (
        // Render actual content
        children
      )}
    </div>
  );
};

export default Skeletons;
