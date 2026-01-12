const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Serve static files from the current directory
app.use(express.static(__dirname));

// For any other requests, serve index.html (SPA routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to quit.');
});