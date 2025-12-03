import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import RandomChat from './pages/RandomChat';
import './App.css';

// Optional layout for future header/footer (currently just a wrapper)
const Layout = ({ children }) => <div className="app-container">{children}</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Default home page */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        {/* Random chat page */}
        <Route
          path="/chat"
          element={
            <Layout>
              <RandomChat />
            </Layout>
          }
        />

        {/* 404 Page: Redirect to home or create a NotFound component */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
