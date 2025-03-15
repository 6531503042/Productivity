const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Create a simple HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Productivity App</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #f8f9fa;
          color: #212121;
        }
        .container {
          text-align: center;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          width: 90%;
        }
        h1 {
          color: #4A6FFF;
          margin-bottom: 1rem;
        }
        p {
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        .features {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        .feature {
          background-color: #f0f4ff;
          padding: 1rem;
          border-radius: 4px;
          width: 45%;
          min-width: 200px;
        }
        .feature h3 {
          color: #4A6FFF;
          margin-top: 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Productivity App</h1>
        <p>Welcome to the Productivity App! This application helps you manage tasks, track projects, and boost your productivity.</p>
        
        <div class="features">
          <div class="feature">
            <h3>Task Management</h3>
            <p>Create, organize, and track your tasks with ease.</p>
          </div>
          <div class="feature">
            <h3>Project Tracking</h3>
            <p>Group related tasks into projects for better organization.</p>
          </div>
          <div class="feature">
            <h3>Analytics</h3>
            <p>View insights about your productivity and task completion.</p>
          </div>
          <div class="feature">
            <h3>Customization</h3>
            <p>Personalize your experience with settings and preferences.</p>
          </div>
        </div>
        
        <p style="margin-top: 2rem;">The mobile app is currently in development. Please check back soon for updates!</p>
      </div>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});