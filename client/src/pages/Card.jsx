import React from "react";
import "./Card.css";
// Card.jsx example
const Card = ({ post }) => {
  return (
    <div className="review-card">
      <h3>{post.product_name}</h3>
      <p>
        <strong>{post.name}</strong> • {post.phone}
      </p>
      <p className="review-text">"{post.review_text}"</p>
      <small>{new Date(post.created_at).toLocaleDateString()}</small>
    </div>
  );
};

export default Card;
