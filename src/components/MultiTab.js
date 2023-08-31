import React, { useState } from "react";
import { Table, Button, Modal, Tabs, Tab, Col, Form, Container, Row, Link } from "react-bootstrap";
import ChatGpt from "./ChatGpt";
import OpenAILogs from "./OpenAILogs";

const MultiTab = (props) => {
  const [currentTab, setCurrentTab] = useState("ChatGpt");

  const handleTabSelect = (tabKey) => {
    setCurrentTab(tabKey);
  };

  return (
    <div>
      <Tabs defaultActiveKey="ChatGpt" activeKey={currentTab} onSelect={handleTabSelect}>
        <Tab eventKey="ChatGpt" title="ChatGpt">
          <ChatGpt />
        </Tab>
        <Tab eventKey="OpenAILogs" title="OpenAi Logs">
          <OpenAILogs />
        </Tab>
      </Tabs>
    </div>
  );
};

export default MultiTab;
