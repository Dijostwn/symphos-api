// server.js (Back-End untuk menerima data lokasi)

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors()); 
app.use(bodyParser.json());

// Simpan data lokasi yang dikirim dari Front-End
let receivedLocations = [];

// Endpoint untuk menerima data lokasi (CREATE)
app.post('/api/location', (req, res) => {
    const { lat, lon } = req.body;
    if (!lat || !lon) {
        return res.status(400).send("Koordinat Latitude dan Longitude diperlukan.");
    }
    
    const newEntry = { 
        timestamp: new Date().toISOString(),
        latitude: lat,
        longitude: lon 
    };
    receivedLocations.push(newEntry);
    console.log("Lokasi baru diterima:", newEntry);
    res.status(201).json({ message: "Lokasi berhasil disimpan di server.", data: newEntry });
});

// Endpoint untuk melihat data lokasi yang tersimpan (READ - opsional)
app.get('/api/location', (req, res) => {
    res.json(receivedLocations);
});

app.get('/', (req, res) => {
    res.send('Location API berjalan!');
});

app.listen(PORT, () => {
    console.log(`Server Location API berjalan di port ${PORT}`);
});
