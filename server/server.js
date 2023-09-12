const express = require("express");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();
const OpenAI = require("openai");
const multer = require("multer");
const path = require("path");

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

let currentFile;

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logRequest(req, res, next);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Uploads will be stored in the "uploads" directory
  },
  filename: (req, file, cb) => {
    const name = Date.now() + path.extname(file.originalname);
    currentFile = name;
    cb(null, name);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = await openAI.files.create({
      file: fs.createReadStream("uploads/" + currentFile),
      purpose: "fine-tune",
    });
    res.json({ message: "File uploaded successfully", file: file });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file." + error.message });
    console.error("Failed to updload files, ", error);
  }
});

app.get("/fetch-uploaded-files", async (req, res) => {
  try {
    const files = await openAI.files.list();
    const fileObjects = await files.data;

    console.log("files: ", fileObjects);
    res.json(fileObjects);
  } catch (error) {
    console.error("Error fetching files, " + error);
    res.status(500).json({ message: "Error fetching files" + error.message });
  }
});

app.post("/start-fine-tuning", async (req, res) => {
  const { filename } = req.body;
  console.log("Filesname : ", filename);
  if (!filename) {
    return res.status(400).json({ message: "Filename is required." });
  }
  try {
    const fineTune = await openAI.fineTuning.jobs.create({
      training_file: filename,
      model: "gpt-3.5-turbo-0613",
    });
    res.json({ message: "Fine-tuning job started successfully.", job: fineTune });
  } catch (error) {
    console.error("Error starting fine-tuning job:", error);
    res.status(500).json({ message: "Error starting fine-tuning job." });
  }
});

app.delete("/delete-file/:file_id", async (req, res) => {
  const file_id = req.params.file_id;

  if (!file_id) {
    return res.status(400).json({ message: "File ID is required." });
  }
  try {
    const result = await openAI.files.del(file_id);
    console.log("File deleted sucessfully");
    res.json({ message: "File deleted successfully.", status: result });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Error deleting file." });
  }
});

app.post("/retrieve-file-content/:file_id", async (req, res) => {
  const file_id = req.params.file_id;

  if (!file_id) {
    return res.status(400).json({ message: "File ID is required." });
  }
  try {
    const content = await openAI.files.retrieveContent(file_id);
    console.log("Content: ", content);
    res.json({ success: true, data: content });
  } catch (error) {
    console.error("Error retrieveing file content", error);
    res.status(500).json({ message: "Error retrieveing file content." + error.nessage });
  }
});

app.get("/get-jobs", async (req, res) => {
  try {
    const list = openAI.fineTuning.jobs.list();
    const jobs = [];
    for await (const fineTune of list) {
      console.log(fineTune);
      jobs.push(fineTune);
    }
    console.log("Jobs fetched: ", jobs);
    res.json({ message: "sucesss", data: jobs });
  } catch (error) {
    const errorMessage = "Error fetching finetuning jobs ";
    console.error(errorMessage + error);
    res.json({ success: false, message: errorMessage, data: null });
  }
});

app.post("/gptquery", async (req, res) => {
  const receivedData = req.body;
  const messages = receivedData;
  console.log("Frontend data: ", receivedData);
  const openAiResponse = await openAI.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 1,
    max_tokens: 125,
  });
  const assistantMessage = await openAiResponse.choices[0].message.content;
  const updatedMessages = [...messages, { role: "assistant", content: assistantMessage }];
  console.log("OpenAIResponse : ", openAiResponse.choices[0].message.content);

  //console.log(response);

  res.status(200).json({ success: true, openai_response: openAiResponse });
});

const port = 4000; // Choose a port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function logRequest(req, res, next) {
  const startTime = new Date();
  console.log(`[${startTime.toISOString()}] ${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    const endTime = new Date();
    const responseTime = endTime - startTime;
    const statusCode = res.statusCode;
    const userAgent = req.get("User-Agent");
    console.log(`[${endTime.toISOString()}] ${req.method}  ${statusCode} ${responseTime}ms `);
  });

  next();
}
