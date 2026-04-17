const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware agar Express bisa membaca data dari Form dan JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Melayani file statis (HTML, CSS, JS) dari folder 'public' jika ada
app.use(express.static(path.join(__dirname, 'public')));

// Database sederhana di memori (akan reset jika server restart)
let articles = [
    { id: 1, title: "Brand Lokal di Paris", category: "Fashion", image: "https://via.placeholder.com/150" }
];

// ENDPOINT: Ambil semua artikel
app.get('/api/articles', (req, res) => {
    res.json(articles);
});

// ENDPOINT: Tambah artikel baru dari form admin
app.post('/api/articles', (req, res) => {
    const { title, category, image, password } = req.body;

    // GANTI 'admin123' dengan password keinginanmu
    if (password !== 'admin123') {
        return res.status(403).send("Password Salah! <a href='/admin.html'>Kembali</a>");
    }

    const newArticle = {
        id: Date.now(),
        title,
        category,
        image
    };

    articles.push(newArticle);
    // Redirect kembali ke halaman admin dengan tanda sukses
    res.redirect('/admin.html?success=1');
});

// ENDPOINT: Hapus artikel
app.get('/api/delete/:id', (req, res) => {
    const { id } = req.params;
    const { pass } = req.query;

    if (pass !== 'admin123') {
        return res.status(403).send("Password Salah!");
    }

    articles = articles.filter(a => a.id != id);
    res.redirect('/admin.html?deleted=1');
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});
