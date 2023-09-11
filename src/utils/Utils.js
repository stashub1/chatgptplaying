export const extractQuestions = (text) => {
  //console.log("Text: ", text);

  // Read the file content

  if (!text || text.length === 0) {
    throw new Error("Text to split questions/answers is empty");
  }

  try {
    const faqRegex = /([^?]+)\?\s*([\s\S]*?)(?=(?:\n{2,}|$))/g;

    // Array to store the extracted questions and answers
    const faqItems = [];
    let match;

    while ((match = faqRegex.exec(text)) !== null) {
      const question = match[1].trim();
      const answer = match[2].trim();
      faqItems.push({ question, answer });
    }
    return faqItems;
    // Log the extracted questions and answers
    console.log(faqItems);
  } catch (error) {
    console.error(error);
  }
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

        result.push({
          role: "user",
          content: currentQuestion,
        });
        result.push({
          role: "assistant",
          content: currentAnswer.trim(),
        });
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
    result.push({
      role: "user",
      content: currentQuestion,
    });
    result.push({
      role: "assistant",
      content: currentAnswer.trim(),
    });
  }
  return result;
};
