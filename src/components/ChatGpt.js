import React, { useState, useRef } from "react";
import { Form, Button, Alert, Card, Row, Col, Stack } from "react-bootstrap";
import AddDocModal from "./AddDocModal";
import { DataProvider } from "../contexts/DataContext";
import useGptRequests from "../controllers/useGptRequests";
import TopPanel from "./TopPanel";

const ChatGpt = (props) => {
  const [error, setError] = useState("");
  const userRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const { sendQuery } = useGptRequests();
  const [showAddData, setShowAddData] = useState(false);
  const [tokenCurrentRequestAmount, setCurrentRequestTokenAmount] = useState(0);
  const [tokenTotalAmount, setTokenTotalAmount] = useState(0);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const userInput = userRef.current.value;
    if (userInput) {
      const userMessageObj = { role: "user", content: userInput };
      const messagesToSend = [...messages, userMessageObj];
      setMessages(messagesToSend);
      console.log("HandleSubmit userMessage : ", userMessageObj);
      try {
        const data = await sendQuery(messagesToSend);
        const receivedMessageObj = data.openai_response.choices[0].message;
        const tokenQuantity = data.openai_response.usage.total_tokens;
        setCurrentRequestTokenAmount(tokenQuantity);
        console.log("Token Quantity: ", tokenQuantity);
        setTokenTotalAmount((prevAmount) => prevAmount + tokenQuantity);
        console.log("Received  : ", receivedMessageObj);
        setMessages((prevMessages) => [...prevMessages, receivedMessageObj]);
      } catch (error) {
        console.error("Error fetching data from server: ", error);
      }
    }
  };

  const openAddDataModal = (e) => {
    e.preventDefault();
    setShowAddData(true);
  };

  return (
    <Stack>
      <div className="">
        <Button onClick={openAddDataModal}>Add data</Button>
        <p>Current total tokens: {tokenTotalAmount}</p>
        <div className="d-flex flex-column justify-content-end h-100">
          {messages.length > 0 && (
            <div className="d-flex flex-column">
              {messages.map((message, index) => {
                return (
                  <p key={index} className="text-left">
                    {message.role} : {message.content}
                  </p>
                );
              })}
            </div>
          )}
          <Card>
            <Card.Body>
              <Form onSubmit={handleChatSubmit} className="d-flex">
                <Form.Control placeholder="User message " ref={userRef} />
                <Button className="signin-button" variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
        <AddDocModal show={showAddData} setShow={setShowAddData} />
      </div>
    </Stack>
  );
};

export default ChatGpt;
