import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="welcome-box">
        <h1>Welcome to TalkChat</h1>
        <p>
          Connect with strangers instantly, share messages and images, and enjoy
          random chats safely.
        </p>
        <Link to="/chat">
          <button className="start-btn">Start Random Chat</button>
        </Link>
      </div>
    </div>
  );
}
