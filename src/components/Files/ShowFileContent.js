import React, { useState, useEffect } from "react";
import { FILE_CONTENT } from "../../utils/Constants";

const ShowFileContent = (props) => {
  const [text, setText] = useState();

  useEffect(() => {
    const fileContent = localStorage.getItem(FILE_CONTENT);
    if (fileContent) {
      setText(fileContent);
      localStorage.removeItem(FILE_CONTENT);
    }
  }, []);

  return (
    <div>
      <pre style={{ whiteSpace: "pre-wrap" }}>{text}</pre>
    </div>
  );
};

export default ShowFileContent;
