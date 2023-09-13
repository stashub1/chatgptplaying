export const readFileContent = (file) => {
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

export const parseQA = (text) => {
  // Split the text by lines
  const lines = text.split("\n");

  const result = [];
  let currentQuestion = null;
  let currentAnswer = "";

  for (let line of lines) {
    // Check if the line is a question
    if (line.endsWith("?")) {
      // If there's a current question, push it and its answer to the result
      if (currentQuestion !== null) {
        currentQuestion = currentQuestion.replace(/[\b\f\n\r\t\v]/g, "");
        currentAnswer = currentAnswer.replace(/[\b\f\n\r\t\v]/g, "");
        const QA = [];
        QA.push({
          role: "user",
          content: currentQuestion,
        });
        QA.push({
          role: "assistant",
          content: currentAnswer.trim(),
        });
        const messages = { messages: QA };
        result.push(messages);
      }
      currentQuestion = line;
      currentAnswer = "";
    } else {
      // Otherwise, append the line to the current answer
      currentAnswer += line + "\n";
    }
  }

  // Push the last question-answer pair if it exists
  if (currentQuestion !== null) {
    currentQuestion = currentQuestion.replace(/[\b\f\n\r\t\v]/g, "");
    currentAnswer = currentAnswer.replace(/[\b\f\n\r\t\v]/g, "");
    const QA = [];

    QA.push({
      role: "user",
      content: currentQuestion,
    });
    QA.push({
      role: "assistant",
      content: currentAnswer.trim(),
    });
    const messages = { messages: QA };
    result.push(messages);
  }
  console.log("Parsing Result : ", result);
  return result;
};
