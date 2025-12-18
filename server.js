const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/api/articles', (req, res) => res.json(articles));

app.post('/api/articles', (req, res) => {
    const { title, category, image } = req.body;
    articles.unshift({ id: Date.now(), title, category, image });
    res.redirect('/admin.html?success=1');
});

// Route untuk menghapus post
app.get('/api/delete/:id', (req, res) => {
    articles = articles.filter(a => a.id != req.params.id);
    res.redirect('/admin.html?deleted=1');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
