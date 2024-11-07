const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Configure Multer to save files to the 'uploads' directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const filename = `captured-${Date.now()}.png`;
        cb(null, filename);
    }
});
const upload = multer({ storage: storage });

// CSV file path
const csvFilePath = path.join(__dirname, 'logs.csv');

// Function to append data to CSV file
function appendToCSV(data) {
    const csvRow = `${data.timestamp},${data.arrowDirection},${data.elapsedTime},${data.filename}\n`;
    fs.appendFile(csvFilePath, csvRow, (err) => {
        if (err) {
            console.error('Error writing to CSV file', err);
        } else {
            console.log('Data successfully written to CSV file');
        }
    });
}

// API endpoint to handle file uploads with additional data
app.post('/api/upload', upload.single('image'), (req, res) => {
    const { elapsedTime, arrowDirection } = req.body;
    const timestamp = new Date().toISOString();  // Current timestamp
    console.log(elapsedTime);
    if (req.file) {
        // Prepare data for CSV logging
        const logData = {
            timestamp,
            arrowDirection,
            elapsedTime,
            filename: req.file.filename
        };

        // Append data to CSV
        appendToCSV(logData);

        // Respond to client
        res.json({ message: 'Image and data uploaded successfully', file: req.file });
    } else {
        res.status(400).json({ message: 'No file uploaded' });
    }
});

// Serve static files
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    // Create CSV file with headers if it doesn't exist
    if (!fs.existsSync(csvFilePath)) {
        fs.writeFileSync(csvFilePath, 'timestamp,arrowDirection,elapsedTime,filename\n', 'utf8');
    }
});
