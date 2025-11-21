// server.js - Full WhatsApp → PostgreSQL Review System

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const { MessagingResponse } = require("twilio").twiml;
const twilio = require("twilio");
const pool = require("./db/db.js"); // PostgreSQL connection

// Routes
const CreatePost = require("./Routes/Post.Route.js");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // For Twilio webhook
app.use(express.json());
app.use(cors());
// {
//     origin:["http://localhost:5174","https://twilio-review-product-pcpgfzra7-abhinavs-projects-dff478f0.vercel.app"]
// }
// {
//   origin: "http://localhost:5174" // Your React frontend
// }
// API Routes
app.use("/api", CreatePost);

// Twilio Client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// In-memory state (for multi-step conversation)
const userCounters = {}; // Tracks current step
const userData = {};     // Stores product, rating, review

// WhatsApp Webhook - Main Conversation Flow
app.post("/replywhatsapp", async (req, res) => {
  const twiml = new MessagingResponse();
  const from = req.body.From;                    // whatsapp:+91...
  const answer = req.body.Body?.trim() || "";

  // Initialize new user
  if (!userCounters[from]) {
    userCounters[from] = 0;
    userData[from] = {};
  }

  let reply = "";
  const step = userCounters[from];

  try {
    if (step === 0) {
      if (["yes", "y", "sure", "ok"].includes(answer.toLowerCase())) {
        userCounters[from] = 1;
        reply = "Which product would you like to review?\n(e.g. Wireless Earbuds, T-Shirt)";
      } else if (["no", "n", "nope"].includes(answer.toLowerCase())) {
        reply = "No problem! Thanks for your time. Have a great day!";
        delete userCounters[from];
        delete userData[from];
      } else {
        reply = "Please reply *YES* to leave a review or *NO* to skip.";
      }
    }

    else if (step === 1) {
       userData[from].product = answer;
    userCounters[from] = 2;
    reply = `what is your name?`;
    }

    else if (step === 2) {
      userData[from].name = answer;
    userCounters[from] = 3;
     reply = `${userData[from].name} please send your review for ${userData[from].product}?`;
    }

    else if (step === 3) {
      userData[from].review = answer;

      const phone = from.replace("whatsapp:", "");

      // SAVE TO POSTGRESQL
      await pool.query(
        `INSERT INTO reviews (phone, product_name, name, review_text)
         VALUES ($1, $2, $3, $4)`,
        [phone, userData[from].product, userData[from].name, userData[from].review]
      );

      console.log("Review saved:", { phone, ...userData[from] });

      reply = `Thank you so much!

Your review is saved:
• Product: ${userData[from].product}
• Rating: ${userData[from].rating} stars
• Review: "${answer}"

We truly appreciate your feedback!`;

      // Reset user state
      delete userCounters[from];
      delete userData[from];
    }

  } catch (error) {
    console.error("Error in conversation:", error);
    reply = "Sorry, something went wrong. Please try again later.";
  }

  twiml.message(reply);
  res.type("text/xml").send(twiml.toString());
});
// Health check
app.get("/", (req, res) => {
  res.send("WhatsApp Review Bot + PostgreSQL is running!");
});

const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Webhook URL: https://your-ngrok-url.ngrok.io/replywhatsapp`);
  console.log(`Send first message: http://localhost:${PORT}/start`);
});