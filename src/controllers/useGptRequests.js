import { useContext } from "react";
import { DataContext } from "../contexts/DataContext";

const useGptRequests = () => {
  const { systemMessage } = useContext(DataContext);

  const sendQuery = async (messages) => {
    let messagesToSend = [];
    const messagesContainSystemMessage = messages.some((message) => message.role === "system");
    if (systemMessage && !messagesContainSystemMessage) {
      const systemMessageComplete = systemMessage + ". Use this text and instructions to have the context of topic and answer the questions of users.";
      console.log("SystemMessage: ", systemMessage);
      messagesToSend = [{ role: "system", content: systemMessageComplete }, ...messages];
    } else {
      messagesToSend = messages;
    }
    console.log("Mesages to send: ", messagesToSend);
    const resp = await fetch("http://localhost:4000/gptquery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagesToSend),
    });
    const data = await resp.json();
    return data;
  };

  return { sendQuery };
};

export default useGptRequests;
