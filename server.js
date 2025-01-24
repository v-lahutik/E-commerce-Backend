import app from './app.js'; // Import app from app.js

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is up on port: ${port} 🚀`);
});
