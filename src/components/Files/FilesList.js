import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Stack, Table } from "react-bootstrap";
import "./styles.css";
import UploadFileModal from "./UploadFileModal";
import { FILE_CONTENT } from "../../utils/Constants";
import UploadJsonlModal from "./UploadJsonlModal";

const FilesList = (props) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showJsonlUploadDialog, setShowJsonlUploadDialog] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isParseDialog, setIsParseDialog] = useState(false);

  useEffect(() => {
    // This code will run when the component mounts
    if (!showUploadDialog) {
      fetchUploadedFiles();
    }
  }, [showUploadDialog, props.refreshKey]);

  useEffect(() => {
    // This code will run when the component mounts
    if (!showJsonlUploadDialog) {
      fetchUploadedFiles();
    }
  }, [showJsonlUploadDialog]);

  const openUploadFileModal = () => {
    setIsParseDialog(false);
    setShowJsonlUploadDialog(true);
  };

  const openParseFileModal = () => {
    setIsParseDialog(true);
    setShowUploadDialog(true);
  };

  const fetchUploadedFiles = async () => {
    console.log("fetchUploadedFiles");
    try {
      const response = await fetch("http://localhost:4000/fetch-uploaded-files");

      if (response.ok) {
        let files = await response.json();
        files = files.sort((a, b) => b.created_at - a.created_at);
        setUploadedFiles(files);
        console.log(files);
      } else {
        console.error("Error fetching uploaded files:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    }
  };

  //ToDo
  const finetune = async (file) => {
    console.log("Finetune ", file);
    try {
      const response = await fetch("http://localhost:4000/start-fine-tuning", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: file }), // Send filename in the request body
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fine-tuning job started:", data.job);
      } else {
        console.error("Error starting fine-tuning job:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:4000/delete-file/${fileId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Deletion response read");
        console.log("Deletion Data message: ", data.message);
        setResponseMessage(data.message);
        setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      } else {
        setResponseMessage("Error deleting file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setResponseMessage("Error deleting file");
    }
  };

  const handleShowContent = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:4000/retrieve-file-content/${fileId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        //const text = parseTextToQA(data.data);
        localStorage.setItem(FILE_CONTENT, data.data);
        const url = `${window.location.origin}/file_content`;
        window.open(url, "_blank");
        //setResponseMessage(data.data);
      } else {
        setResponseMessage("Error deleting file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setResponseMessage("Error deleting file");
    }
  };

  return (
    <>
      <Button className="mt-2" onClick={openUploadFileModal}>
        Upload jsonl File
      </Button>
      <Button className="ms-2 mt-2" variant="light" onClick={openParseFileModal}>
        Parse questions
      </Button>

      <Stack className="mt-3">
        <p>{responseMessage}</p>
        {uploadedFiles && uploadedFiles.length > 0 && (
          <div>
            <h4>Uploaded Files:</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Object</th>
                  <th>Filename</th>
                  <th>Bytes</th>
                  <th>Status</th>
                  <th>Status Details</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file) => (
                  <tr key={file.id}>
                    <td>{file.id}</td>
                    <td>{file.object}</td>
                    <td>{file.filename}</td>
                    <td>{file.bytes}</td>

                    <td>{file.status}</td>
                    <td>{file.status_details}</td>
                    <td>{new Date(file.created_at * 1000).toLocaleString()}</td>
                    <td>
                      <Button className="ms-2" variant="primary" onClick={() => finetune(file.id)}>
                        Finetune
                      </Button>
                      <Button className="ms-2" variant="light" onClick={() => handleShowContent(file.id)}>
                        Show content
                      </Button>
                      <Button className="ms-2" variant="light" onClick={() => handleDeleteFile(file.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        <UploadFileModal parse={isParseDialog} show={showUploadDialog} setShow={setShowUploadDialog} />
        <UploadJsonlModal show={showJsonlUploadDialog} setShow={setShowJsonlUploadDialog} />
      </Stack>
    </>
  );
};

export default FilesList;
