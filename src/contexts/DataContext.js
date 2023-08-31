import React, { createContext, useState } from "react";
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [systemMessage, setSystemMessage] = useState("");

  const setSystemMessageWithLog = (message) => {
    console.log("SystemMessage set: ", message);
    setSystemMessage(message);
  };

  const exported = { systemMessage, setSystemMessage: setSystemMessageWithLog };

  return <DataContext.Provider value={exported}>{children}</DataContext.Provider>;
};
