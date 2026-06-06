"use client";

import { UserDetailsContext } from "@/context/UserDetailsContext";
import axios from "axios";
import React, { useEffect, useState } from "react";

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userDetails, setUserDetails] = useState<any>();

  useEffect(() => {
    CreateNewUser();
  }, []);

  const CreateNewUser = async () => {
    try {
      const result = await axios.post("/api/users");

      console.log("Result:", result);
      setUserDetails(result.data?.user);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserDetailsContext.Provider>
  );
}

export default Provider;