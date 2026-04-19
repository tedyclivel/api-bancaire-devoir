const express = require('express');
const app = express();

app.use(express.json());

let comptes = [];
let idCounter = 1;

// Route test
app.get('/', (req, res) => {
    res.send("API bancaire opérationnelle");
});

// Création compte
app.post('/comptes', (req, res) => {
    const { nom, email, soldeInitial } = req.body;

    if (!nom || !email) {
        return res.status(400).json({ message: "Nom et email requis" });
    }

    const exist = comptes.find(c => c.email === email);
    if (exist) {
        return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const nouveauCompte = {
        id: idCounter++,
        nom,
        email,
        solde: soldeInitial || 0,
        date_creation: new Date()
    };

    comptes.push(nouveauCompte);

    res.status(201).json(nouveauCompte);
});

// Liste comptes
app.get('/comptes', (req, res) => {
    res.json(comptes);
});

// Dépôt
app.post('/comptes/:id/depot', (req, res) => {
    const compte = comptes.find(c => c.id == req.params.id);
    const { montant } = req.body;

    if (!compte) return res.status(404).json({ message: "Compte non trouvé" });

    if (!montant || typeof montant !== "number" || montant <= 0) {
        return res.status(400).json({ message: "Montant invalide" });
    }

    compte.solde += montant;

    res.json({ message: "Dépôt réussi", compte });
});

// Retrait
app.post('/comptes/:id/retrait', (req, res) => {
    const compte = comptes.find(c => c.id == req.params.id);
    const { montant } = req.body;

    if (!compte) return res.status(404).json({ message: "Compte non trouvé" });

    if (!montant || typeof montant !== "number" || montant <= 0) {
        return res.status(400).json({ message: "Montant invalide" });
    }

    if (compte.solde < montant) {
        return res.status(400).json({ message: "Solde insuffisant" });
    }

    compte.solde -= montant;

    res.json({ message: "Retrait réussi", compte });
});

// Port dynamique Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});