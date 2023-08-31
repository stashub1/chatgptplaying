import logo from "./logo.svg";
import "./App.css";
import ChatGpt from "./components/ChatGpt";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./contexts/DataContext";

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <main className="flex-shrink-0">
          <div className="container">
            <Routes>
              <Route exact path="/" element={<ChatGpt />} />
            </Routes>
          </div>
        </main>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
