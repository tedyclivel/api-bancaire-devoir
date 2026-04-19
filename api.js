const express = require('express');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

app.use(express.json());

/* =========================
   🔥 SWAGGER CONFIG
========================= */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Bancaire",
      version: "1.0.0",
      description: "API de gestion bancaire (comptes, dépôts, retraits)"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: ["./api.js"]
};

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/* =========================
   💾 BASE DE DONNÉES SIMULÉE
========================= */
let comptes = [];
let idCounter = 1;

/* =========================
   🌐 ROUTE TEST
========================= */
app.get('/', (req, res) => {
  res.send("API bancaire opérationnelle 🚀");
});

/* =========================
   🧾 CREATION COMPTE
========================= */
/**
 * @swagger
 * /comptes:
 *   post:
 *     summary: Créer un compte bancaire
 *     tags: [Comptes]
 */
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

/* =========================
   📋 LISTE COMPTES
========================= */
app.get('/comptes', (req, res) => {
  res.json(comptes);
});

/* =========================
   💰 DEPOT
========================= */
app.post('/comptes/:id/depot', (req, res) => {
  const compte = comptes.find(c => c.id == req.params.id);
  const { montant } = req.body;

  if (!compte) {
    return res.status(404).json({ message: "Compte non trouvé" });
  }

  if (!montant || typeof montant !== "number" || montant <= 0) {
    return res.status(400).json({ message: "Montant invalide" });
  }

  compte.solde += montant;

  res.json({ message: "Dépôt réussi", compte });
});

/* =========================
   💸 RETRAIT
========================= */
app.post('/comptes/:id/retrait', (req, res) => {
  const compte = comptes.find(c => c.id == req.params.id);
  const { montant } = req.body;

  if (!compte) {
    return res.status(404).json({ message: "Compte non trouvé" });
  }

  if (!montant || typeof montant !== "number" || montant <= 0) {
    return res.status(400).json({ message: "Montant invalide" });
  }

  if (compte.solde < montant) {
    return res.status(400).json({ message: "Solde insuffisant" });
  }

  compte.solde -= montant;

  res.json({ message: "Retrait réussi", compte });
});

/* =========================
   🚀 SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});