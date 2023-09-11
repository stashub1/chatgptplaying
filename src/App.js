import logo from "./logo.svg";
import "./App.css";
import ChatGpt from "./components/ChatGpt";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./contexts/DataContext";
import MultiTab from "./components/MultiTab";
import TestComponent from "./components/TestComponent";
import ShowFileContent from "./components/Files/ShowFileContent";

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <main className="flex-shrink-0">
          <div className="container">
            <Routes>
              <Route exact path="/" element={<MultiTab />} />
              <Route exact path="/test" element={<TestComponent />} />
              <Route exact path="/file_content" element={<ShowFileContent />} />
            </Routes>
          </div>
        </main>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
