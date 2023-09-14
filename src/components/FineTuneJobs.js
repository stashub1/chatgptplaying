import React, { useState, useEffect } from "react";
import { Button, Stack, Table } from "react-bootstrap";
import DetailsModal from "./modals/DetailsModal";

const FineTuneJobs = (props) => {
  const [jobs, setJobs] = useState([]);
  const [active, setActive] = useState(false);
  const [jobTextData, setJobTextData] = useState("");
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    getJobs();
  }, [props.refreshKey]);

  const getJobs = async () => {
    console.log("Get Jobs");
    try {
      const response = await fetch("http://localhost:4000/get-jobs");
      if (response.ok) {
        const data = await response.json();
        const jobs = data.data;

        setJobs(jobs);
        console.log("Jobs : ", jobs);
        console.log("Message: ,", data);
      }
    } catch (error) {
      console.error("Error getting list of finetune jobs" + error);
    }
  };

  const handleJobDetails = (job) => {
    setJobTextData(JSON.stringify(job), null, 2);
    setShowDetailsDialog(true);
  };

  return (
    <div>
      <h2 className="mt-2">Finetune Jobs list</h2>
      {jobs && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Created at</th>
              <th>Result files</th>
              <th>Status</th>
              <th>Trained tokens</th>
              <th>Training file</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs &&
              jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{new Date(job.created_at * 1000).toLocaleString()}</td>
                  <td>{job.result_files}</td>
                  <td>{job.status}</td>
                  <td>{job.trained_tokens}</td>
                  <td>{job.training_file}</td>
                  <Button variant="primary" onClick={() => handleJobDetails(job)}>
                    Details
                  </Button>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
      <DetailsModal show={showDetailsDialog} data={jobTextData} setShow={setShowDetailsDialog} />
    </div>
  );
};

export default FineTuneJobs;
