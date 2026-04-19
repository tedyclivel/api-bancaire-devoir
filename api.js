const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

/* =========================
    DONNÉES SIMULÉES
========================= */
let comptes = [];
let idCounter = 1;

/* =========================
    ROUTE TEST
========================= */
app.get('/', (req, res) => {
  res.send("API bancaire opérationnelle 🚀");
});

/* =========================
    SWAGGER CONFIG
========================= */
const specs = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Bancaire",
      version: "1.0.0",
      description: "Gestion des comptes bancaires"
    },
    servers: [
      {
        url: "https://api-bancaire-devoir-1.onrender.com"
      }
    ]
  },
  apis: []
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/* =========================
    CREER COMPTE
========================= */
app.post('/comptes', (req, res) => {
  const { nom, email, soldeInitial } = req.body;

  if (!nom || !email) {
    return res.status(400).json({ message: "Nom et email requis" });
  }

  const compte = {
    id: idCounter++,
    nom,
    email,
    solde: soldeInitial || 0,
    date_creation: new Date()
  };

  comptes.push(compte);

  res.status(201).json(compte);
});

/* =========================
    LISTE COMPTES
========================= */
app.get('/comptes', (req, res) => {
  res.json(comptes);
});

/* =========================
    DEPOT
========================= */
app.post('/comptes/:id/depot', (req, res) => {
  const compte = comptes.find(c => c.id == req.params.id);
  const { montant } = req.body;

  if (!compte) return res.status(404).json({ message: "Compte introuvable" });

  compte.solde += montant;

  res.json(compte);
});

/* =========================
    RETRAIT
========================= */
app.post('/comptes/:id/retrait', (req, res) => {
  const compte = comptes.find(c => c.id == req.params.id);
  const { montant } = req.body;

  if (!compte) return res.status(404).json({ message: "Compte introuvable" });

  if (compte.solde < montant) {
    return res.status(400).json({ message: "Solde insuffisant" });
  }

  compte.solde -= montant;

  res.json(compte);
});

/* =========================
    SERVEUR
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur ${PORT}`);
});