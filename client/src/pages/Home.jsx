import Card from "./Card";
import "./Home.css";
import axios from "axios";
import { useEffect, useState } from "react";

const CardShimmer = () => (
  <div className="card-shimmer">
    <div className="shimmer-img"></div>
    <div className="shimmer-line"></div>
    <div className="shimmer-line short"></div>
  </div>
);

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BackEndUrl = import.meta.env.VITE_BACKEND;
  // Fetch reviews from your backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BackEndUrl}/getallposts`);

        if (response.data.success) {
          setPosts(response.data.data); // This contains your reviews
        } else {
          setError("Failed to load reviews");
        }
      } catch {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="Main-Blk">
      <h1>Customer Reviews from WhatsApp</h1>

      {/* Error Message */}
      {error && <p className="error-text">{error}</p>}

      {/* Loading State */}
      {loading ? (
        <div className="card-grid">
          {[...Array(6)].map((_, i) => (
            <CardShimmer key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="no-reviews">No reviews yet. Be the first!</p>
      ) : (
        <div className="card-grid">
          {posts.map((post) => (
            <Card key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
