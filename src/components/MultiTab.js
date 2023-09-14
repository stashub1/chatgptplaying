import React, { useState } from "react";
import { Table, Button, Modal, Tabs, Tab, Col, Form, Container, Row, Link } from "react-bootstrap";
import ChatGpt from "./ChatGpt";
import OpenAILogs from "./OpenAILogs";
import FileList from "./Files/FilesList";
import FineTuneJobs from "./FineTuneJobs";

const MultiTab = (props) => {
  const [currentTab, setCurrentTab] = useState("ChatGpt");
  const [finetuneJobsRefreshKey, setFinetuneJobsRefreshKey] = useState(0);
  const [filelistRefreshKey, setFilelistsRefreshKey] = useState(0);

  const handleTabSelect = (tabKey) => {
    if (tabKey === "Finetune_Jobs") {
      console.log("Set FinetuneJobs key");
      setFinetuneJobsRefreshKey((prevKey) => prevKey + 1);
    } else if (tabKey === "FIles") {
      setFilelistsRefreshKey((prevkey) => prevkey + 1);
    }
    setCurrentTab(tabKey);
  };

  return (
    <div>
      <Tabs defaultActiveKey="ChatGpt" activeKey={currentTab} onSelect={handleTabSelect}>
        <Tab eventKey="ChatGpt" title="ChatGpt">
          <ChatGpt />
        </Tab>
        <Tab eventKey="FIles" title="Files">
          <FileList refreshKey={filelistRefreshKey} />
        </Tab>
        <Tab eventKey="Finetune_Jobs" title="Finetune Jobs">
          <FineTuneJobs refreshKey={finetuneJobsRefreshKey} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default MultiTab;
