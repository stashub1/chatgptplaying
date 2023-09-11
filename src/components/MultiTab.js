import React, { useState } from "react";
import { Table, Button, Modal, Tabs, Tab, Col, Form, Container, Row, Link } from "react-bootstrap";
import ChatGpt from "./ChatGpt";
import OpenAILogs from "./OpenAILogs";
import FileList from "./Files/FilesList";
import FineTuneJobs from "./FineTuneJobs";

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
        <Tab eventKey="FIles" title="Files">
          <FileList />
        </Tab>
        <Tab eventKey="Finetune_Jobs" title="Finetune Jobs">
          <FineTuneJobs />
        </Tab>
      </Tabs>
    </div>
  );
};

export default MultiTab;
