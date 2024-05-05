import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage/index.jsx";
import DetailPage from "./pages/DetailPage/index.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/pokemon/:id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;