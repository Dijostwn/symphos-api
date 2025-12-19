const express = require('express');
const path = require('path');
const app = express();

// 1. PENGATURAN PORT (Wajib untuk Railway)
const PORT = process.env.PORT || 3000;

// 2. GANTI PASSWORD INI (Hanya kamu yang tahu)
const ADMIN_PASSWORD = "kuncirahasia123"; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyajikan file statis dari folder public (index.html dll)
app.use(express.static(path.join(__dirname, 'public')));

// Database sementara
let articles = [
    {
        id: 1,
        category: "Fashion",
        title: "Brand Lokal Menembus Pasar Paris Fashion Week",
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800"
    },
    {
        id: 2,
        category: "Culture",
        title: "Seni Jalanan Jakarta: Ekspresi Tanpa Batas",
        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800"
    }
];

// --- ROUTING ---

// 3. JALUR RAHASIA KE HALAMAN ADMIN
// Sekarang kamu akses admin lewat: link-railway.app/hanya-saya-yang-tahu
app.get('/hanya-saya-yang-tahu', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// API untuk ambil semua artikel
app.get('/api/articles', (req, res) => res.json(articles));

// 4. API UNTUK POST ARTIKEL (DENGAN CEK PASSWORD)
app.post('/api/articles', (req, res) => {
    const { title, category, image, password } = req.body;

    // Cek apakah password yang dimasukkan di form benar
    if (password !== ADMIN_PASSWORD) {
        return res.status(403).send("<h1>Akses Ditolak: Password Salah!</h1><a href='/hanya-saya-yang-tahu'>Kembali</a>");
    }

    articles.unshift({ 
        id: Date.now(), 
        title, 
        category, 
        image: image || "https://via.placeholder.com/800x600" 
    });

    // Balik ke halaman admin rahasia setelah sukses
    res.redirect('/hanya-saya-yang-tahu?success=1');
});

// 5. API UNTUK HAPUS ARTIKEL (DENGAN CEK PASSWORD)
app.get('/api/delete/:id', (req, res) => {
    const pass = req.query.pass;

    if (pass !== ADMIN_PASSWORD) {
        return res.status(403).send("Akses Ditolak: Kamu tidak punya izin!");
    }

    articles = articles.filter(a => a.id != req.params.id);
    res.redirect('/hanya-saya-yang-tahu?deleted=1');
});

// 6. MENJALANKAN SERVER
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Folkative Clone jalan di port ${PORT}`);
});
