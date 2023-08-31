const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const openAI = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logRequest(req, res, next);
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
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
