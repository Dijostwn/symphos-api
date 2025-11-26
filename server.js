const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors()); 
app.use(bodyParser.json());

// Data Disimpan di Memori Server (Simulasi Database)
let overtimeRequests = [
    { id: 1, name: "Budi Santoso", date: "2025-11-25", startTime: "18:00", endTime: "20:00", hours: 2, status: "Pending" },
    { id: 2, name: "Ani Wijaya", date: "2025-11-26", startTime: "17:30", endTime: "19:00", hours: 1.5, status: "Approved" }
];
let nextId = 3;

function calculateHours(start, end) {
    const startParts = start.split(':').map(Number);
    const endParts = end.split(':').map(Number);
    
    const startMinutes = startParts[0] * 60 + startParts[1];
    const endMinutes = endParts[0] * 60 + endParts[1];
    
    let durationMinutes = endMinutes - startMinutes;
    
    if (durationMinutes < 0) {
        durationMinutes += 24 * 60; 
    }
    
    return durationMinutes / 60;
}

// 1. READ (GET)
app.get('/api/overtime', (req, res) => {
    res.json(overtimeRequests);
});

// 2. CREATE (POST)
app.post('/api/overtime', (req, res) => {
    const { name, date, startTime, endTime } = req.body;

    if (!name || !date || !startTime || !endTime) {
        return res.status(400).send("Semua field harus diisi.");
    }

    const hours = calculateHours(startTime, endTime);

    const newRequest = { 
        id: nextId++, 
        name, 
        date, 
        startTime, 
        endTime, 
        hours: parseFloat(hours.toFixed(2)),
        status: "Pending" 
    };
    
    overtimeRequests.push(newRequest);
    res.status(201).json(newRequest);
});

// 3. DELETE
app.delete('/api/overtime/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = overtimeRequests.length;
    overtimeRequests = overtimeRequests.filter(item => item.id !== id);
    
    if (overtimeRequests.length < initialLength) {
        res.status(200).send(`Permintaan lembur ID ${id} berhasil dihapus.`);
    } else {
        res.status(404).send("Permintaan lembur tidak ditemukan.");
    }
});

app.get('/', (req, res) => {
    res.send('Overtime API berjalan!');
});

app.listen(PORT, () => {
    console.log(`Server Overtime API berjalan di port ${PORT}`);
});
