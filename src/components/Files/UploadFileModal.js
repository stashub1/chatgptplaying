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
    const textToView = preparedText.map((obj) => JSON.stringify(obj), null, 2).join("\n");
    console.log("ShowContent : ", textToView);
    const url = `${window.location.origin}/file_content`;
    window.open(url, "_blank");
    viewTextOnPage(textToView);
  };

  function viewTextOnPage(text) {
    localStorage.setItem(FILE_CONTENT, text);
    const url = `${window.location.origin}/file_content`;
    window.open(url, "_blank");
  }

  async function prepareJsonlText() {
    try {
      let parsedQA = [];
      let systemMessage = systemMessageRef.current.value;

      if (selectedFile) {
        console.log("prepareJsonlText SelectedFile : ", selectedFile);

        const fileContent = await readFileContent(selectedFile);
        parsedQA = parseQA(fileContent);
      }

      if (systemMessage !== "") {
        systemMessage = systemMessage.replace(/[\b\f\n\r\t\v]/g, "");
        let systemMessageObject = { role: "system", content: systemMessage };
        if (parsedQA[0]) {
          console.log("prepareJsonlText Paesed QA not empty :", parsedQA[0]);
          parsedQA[0].messages.unshift(systemMessageObject);
        } else {
          const messagesArray = [];
          messagesArray.push(systemMessageObject);
          const systemMessagesObjectWithArray = { messages: messagesArray };
          console.log("System obj :  ", systemMessagesObjectWithArray);
          parsedQA.unshift(systemMessagesObjectWithArray);
        }
      }
      //const parseQAWithMessages = { messages: parsedQA };
      console.log("prepareJsonlText setPArseAFull : ", parsedQA);
      setParsedQAFull(parsedQA);
      return parsedQA;
    } catch (error) {
      console.error(error);
      setError("Error reading file or reading system content: " + error.message);
    }
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
    const formData = new FormData();
    // Create a new Blob object with the file content
    const preparedText = await prepareJsonlText();

    console.log("File Blob parsedQAFull : ", preparedText);
    const fileText = preparedText.map((obj) => JSON.stringify(obj), null, 2).join("\n");
    const blob = new Blob([fileText], { type: "application/json" });
    console.log("File blob: ", preparedText);
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
