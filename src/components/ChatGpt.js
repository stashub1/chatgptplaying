import React, { useState, useRef } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import "./styles.css";

const ChatGpt = (props) => {
  const [error, setError] = useState("");
  const userRef = useRef(null);
  const [messages, setMessages] = useState([]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const userMessage = userRef.current.value;
    if (userMessage) {
      const newMessages = [...messages, { role: "user", content: userMessage }];
      console.log("HandleSubmit userMessage : ", userMessage);
      try {
        const resp = await fetch("http://localhost:4000/gptquery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessages),
        });

        const data = await resp.json();
        console.log("Received mesages: ", data.messages);

        const receivedMessages = data.messages;
        setMessages(receivedMessages);
      } catch (error) {
        console.error("Error fetching data from server: ", error);
      }
    }
  };

  return (
    <div className="flex p-4 align-items-center justify-content-center mx-auto vh-100">
      <div>
        <Card>
          <Card.Body className="d-flex flex-column">
            {messages &&
              messages.map((message, index) => {
                return (
                  <p key={index} className="text-left">
                    {message.role} : {message.content}
                  </p>
                );
              })}
          </Card.Body>
        </Card>
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
    </div>
  );
};

export default ChatGpt;
