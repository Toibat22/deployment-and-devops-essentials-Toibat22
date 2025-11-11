import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Import Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CreatePost from "./Pages/CreatePost";
import SinglePost from "./Pages/SinglePost";
import EditPost from "./Pages/EditPost";
import DeletePost from "./Pages/DeletePost";
const token = localStorage.getItem("token"); //  Get user token

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={token ? <Home /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post/:id" element={token ? <SinglePost /> : <Login />} />
        <Route path="/create-post" element={token ? <CreatePost /> : <Login />} />
        <Route path="/post/:id/edit" element={localStorage.getItem("token") ? <EditPost /> : <Login />} />
        <Route path="/post/delete/:id" element={<DeletePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;