import { Link } from 'react-router-dom';
import '../App.css';

export default function Home() {
  return (
    <div className="app-container">
      <h1>Welcome to TalkChat</h1>
      <Link to="/chat">
        <button className="search-btn">Start Random Chat</button>
      </Link>
    </div>
  );
}
