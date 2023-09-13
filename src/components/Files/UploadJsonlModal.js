import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Stack, Table, Row, Col, Modal, Form } from "react-bootstrap";
import { readFileContent } from "../../utils/Utils";
import { FILE_CONTENT } from "../../utils/Constants";

const UploadJsonlModal = (props) => {
  const [selectedFile, setSelectedFile] = useState();
  const [error, setError] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [fileError, setFileError] = useState(false);

  function isParsedJsonlFile(file) {
    return file.name.endsWith(".jsonl");
  }

  async function handleShowContent() {
    if (selectedFile) {
      let fileContent = await readFileContent(selectedFile);
      localStorage.setItem(FILE_CONTENT, fileContent);
      const url = `${window.location.origin}/file_content`;
      window.open(url, "_blank");
    } else {
      setError("Sorry, no selected file found");
      console.error("No selected file found to view");
    }
  }

  const onDrop = async (acceptedFiles) => {
    console.log("Accepteble file : ", acceptedFiles[0]);
    if (isParsedJsonlFile(acceptedFiles[0])) {
      setSelectedFile(acceptedFiles[0]);
      setError("");
      setFileError(false);
      console.log("onDrop SelectedFile : ", acceptedFiles[0]);
      //await prepareJsonlText(acceptedFiles[0]);
    } else {
      setSelectedFile(null);
      setFileError(true);
      setError("Is should be only a  *.jsonl file");
    }
  };

  const closeModal = () => {
    setSelectedFile(null);
    setError("");
    setResponseMessage("");
    props.setShow(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUploadFileToOpenAI = async () => {
    console.log("handleUploadFileToOpenAI: ");
    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log("File: ", selectedFile);
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
            <Form.Label>Choose file with questions and answers .jsonl format</Form.Label>

            <div {...getRootProps()} className={`mt-2 dropzone ${isDragActive ? "active " : ""} ${fileError ? "is-invalid" : ""}`}>
              <input {...getInputProps()} />
              {isDragActive ? <p>Drop the files here...</p> : <div className="plus-sign">+</div>}
            </div>
            <p className="mt-2 center-content"> {selectedFile && `Selected file: ${selectedFile.name}`}</p>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {selectedFile && <Button onClick={handleUploadFileToOpenAI}>Upload File to OpenAi</Button>}
          {selectedFile && (
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

export default UploadJsonlModal;
