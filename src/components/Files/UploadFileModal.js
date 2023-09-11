import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Stack, Table, Row, Col, Modal, Form } from "react-bootstrap";
import { extractQuestions, parseQA } from "../../utils/Utils";
import { FILE_CONTENT } from "../../utils/Constants";

const UploadFileModal = (props) => {
  const [selectedFile, setSelectedFile] = useState();
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");
  const [systemMessageData, setSystemMessageData] = useState("");
  const [fileError, setFileError] = useState(false);
  const systemMessageRef = useRef(null);
  const [isJsonlFile, setIsJsonlFile] = useState(false);
  const [parsedQAFull, setParsedQAFull] = useState("");

  function isParsedJsonlOrTxtFile(file) {
    // Check if the file type starts with "text/"
    let jsonlCheck = file.name.endsWith(".jsonl");
    if (jsonlCheck) {
      setIsJsonlFile(true);
    } else {
      setIsJsonlFile(false);
    }

    let isTxtFile = file.name.endsWith(".txt");
    return jsonlCheck || isTxtFile;
  }

  const handleShowContent = async () => {
    const fullQA = await prepareJsonlText();
    console.log("FullQa : ", fullQA);
    console.log("parsedQAFull : ");
    viewTextOnPage(fullQA);
  };

  async function prepareJsonlText() {
    try {
      let parsedQA = [];
      const systemMessage = systemMessageRef.current.value;
      if (selectedFile) {
        const fileContent = await readFileContent(selectedFile);
        parsedQA = parseQA(fileContent);
      }
      if (systemMessage !== "") {
        let systemMessage = systemMessageRef.current.value;
        systemMessage = systemMessage.replace(/[\b\f\n\r\t\v]/g, "");
        let systemMessageObject = { role: "system", content: systemMessage };
        parsedQA.unshift(systemMessageObject);
      }
      const parseQAWithMessages = { messages: parsedQA };
      setParsedQAFull(parseQAWithMessages);
      return parseQAWithMessages;
    } catch (error) {
      setError("Error reading file or reading system content: " + error.message);
    }
  }

  function viewTextOnPage(parsedQA) {
    localStorage.setItem(FILE_CONTENT, JSON.stringify(parsedQA, null, 2));
    const url = `${window.location.origin}/file_content`;
    window.open(url, "_blank");
  }

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (event) => {
        reject(new Error("Error reading file: " + event.target.error));
      };
      reader.readAsText(file);
    });
  };

  const onDrop = (acceptedFiles) => {
    console.log("Acceptede file : ", acceptedFiles[0]);
    if (isParsedJsonlOrTxtFile(acceptedFiles[0])) {
      setSelectedFile(acceptedFiles[0]);
      setError("");
      setFileError(false);
    } else {
      setSelectedFile(null);
      setFileError(true);
      setError("Is should be only a *.txt file or *.jsonl file");
    }
  };

  const closeModal = () => {
    setSelectedFile(null);
    setResponseMessage("");
    setError("");
    props.setShow(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUploadFileToOpenAI = async () => {
    console.log("Files: ", selectedFile);

    const formData = new FormData();
    formData.append("file", selectedFile);
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
            <Form.Label>Choose file with questions and answers in .txt or .jsonl format</Form.Label>

            <div {...getRootProps()} className={`mt-2 dropzone ${isDragActive ? "active " : ""} ${fileError ? "is-invalid" : ""}`}>
              <input {...getInputProps()} />
              {isDragActive ? <p>Drop the files here...</p> : <div className="plus-sign">+</div>}
            </div>
            <p className="mt-2 center-content"> {selectedFile && `Selected file: ${selectedFile.name}`}</p>
            {props.parse && !isJsonlFile && (
              <Form>
                <Form.Label>Set system section content</Form.Label>
                <Form.Control as="textarea" rows={5} ref={systemMessageRef} onChange={(e) => setSystemMessageData(e.target.value)}></Form.Control>
              </Form>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {selectedFile && !props.parse && <Button onClick={handleUploadFileToOpenAI}>Upload File to OpenAi</Button>}
          {(selectedFile || systemMessageData) && props.parse && <Button onClick={handleUploadFileToOpenAI}>Upload file</Button>}
          {(selectedFile || systemMessageData) && props.parse && !isJsonlFile && (
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
