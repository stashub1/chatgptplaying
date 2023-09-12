import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Stack, Table, Row, Col, Modal, Form } from "react-bootstrap";
import { readFileContent, parseQA } from "../../utils/Utils";
import { FILE_CONTENT } from "../../utils/Constants";

const UploadFileModal = (props) => {
  const [selectedFile, setSelectedFile] = useState();
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");
  const [systemMessageData, setSystemMessageData] = useState("");
  const [fileError, setFileError] = useState(false);
  const systemMessageRef = useRef(null);
  const [parsedQAFull, setParsedQAFull] = useState(null);

  function isParsedJsonlOrTxtFile(file) {
    let isTxtFile = file.name.endsWith(".txt");
    return isTxtFile;
  }

  const handleShowContent = async () => {
    const preparedText = await prepareJsonlText();
    console.log("ShowContent : ", preparedText);
    localStorage.setItem(FILE_CONTENT, JSON.stringify(preparedText, null, 2));
    const url = `${window.location.origin}/file_content`;
    window.open(url, "_blank");
    console.log("FullQa : ", JSON.stringify(preparedText, null, 2));
    viewTextOnPage(preparedText);
  };

  async function prepareJsonlText() {
    console.log("PrepareJsonlText started");
    try {
      let parsedQA = [];
      let systemMessage = systemMessageRef.current.value;
      console.log("System message :  ", systemMessage);
      console.log("System not empty :  ", systemMessage !== "");

      if (selectedFile) {
        console.log("prepareJsonlText SelectedFile : ", selectedFile);

        const fileContent = await readFileContent(selectedFile);
        parsedQA = parseQA(fileContent);
      }
      if (systemMessage !== "") {
        systemMessage = systemMessage.replace(/[\b\f\n\r\t\v]/g, "");
        let systemMessageObject = { role: "system", content: systemMessage };
        console.log("System obj :  ", systemMessageObject);
        parsedQA.unshift(systemMessageObject);
      }
      const parseQAWithMessages = { messages: parsedQA };
      console.log("prepareJsonlText setPArseAFull : ", parseQAWithMessages);
      setParsedQAFull(parseQAWithMessages);
      return parseQAWithMessages;
    } catch (error) {
      console.error(error);
      setError("Error reading file or reading system content: " + error.message);
    }
  }

  function viewTextOnPage(text) {
    localStorage.setItem(FILE_CONTENT, JSON.stringify(text, null, 2));
    const url = `${window.location.origin}/file_content`;
    window.open(url, "_blank");
  }

  const onDrop = async (acceptedFiles) => {
    console.log("Accepteble file : ", acceptedFiles[0]);
    if (isParsedJsonlOrTxtFile(acceptedFiles[0])) {
      setSelectedFile(acceptedFiles[0]);
      setError("");
      setFileError(false);
      console.log("onDrop SelectedFile : ", acceptedFiles[0]);
      await prepareJsonlText(acceptedFiles[0]);
    } else {
      setSelectedFile(null);
      setFileError(true);
      setError("Is should be only a *.txt file");
    }
  };

  const closeModal = () => {
    setSelectedFile(null);
    setResponseMessage("");
    setError("");
    setFileError(false);
    setSystemMessageData("");
    setParsedQAFull(null);
    props.setShow(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUploadFileToOpenAI = async () => {
    console.log("handleUploadFileToOpenAI: ");

    const formData = new FormData();

    console.log("File Creating Blob");
    // Create a new Blob object with the file content
    console.log("File Blob parsedQAFull : ", parsedQAFull);

    const blob = new Blob([JSON.stringify(parsedQAFull)], { type: "application/json" });
    console.log("File blob: ", blob);
    formData.append("file", blob, "parsedQA.jsonl");

    try {
      const response = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Data: ", data);
        setResponseMessage(data.file.name);
        closeModal();
      } else {
        const data = await response.json();
        setResponseMessage("File upload failed, " + data.message);
        setError("file upload failed, " + data.message);
      }
    } catch (error) {
      console.error("Error uploading file : " + error);
      setError("Error uploading file, " + error);
      setResponseMessage("An error occurred during file upload");
      setSelectedFile([]);
    }
  };

  return (
    <div>
      <Modal show={props.show} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="parent-container ">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <Form.Label>Choose file with questions and answers in .txt format</Form.Label>

            <div {...getRootProps()} className={`mt-2 dropzone ${isDragActive ? "active " : ""} ${fileError ? "is-invalid" : ""}`}>
              <input {...getInputProps()} />
              {isDragActive ? <p>Drop the files here...</p> : <div className="plus-sign">+</div>}
            </div>
            <p className="mt-2 center-content"> {selectedFile && `Selected file: ${selectedFile.name}`}</p>

            <Form>
              <Form.Label>Set system section content</Form.Label>
              <Form.Control as="textarea" rows={5} ref={systemMessageRef} onChange={(e) => setSystemMessageData(e.target.value)}></Form.Control>
            </Form>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {(selectedFile || systemMessageData) && <Button onClick={handleUploadFileToOpenAI}>Upload file</Button>}
          {(selectedFile || systemMessageData) && (
            <Button onClick={handleShowContent} variant="light">
              Pre-show file content
            </Button>
          )}

          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UploadFileModal;
