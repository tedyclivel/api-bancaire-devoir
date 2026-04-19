const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const cors = require('cors');

app.use(cors());
app.use(express.json());
const app = express();
app.use(express.json());

/* =========================
   DONNÉES SIMULÉES
========================= */
let comptes = [];
let idCounter = 1;

/* =========================
   SWAGGER CONFIG
========================= */
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Bancaire API304",
      version: "1.0.0",
      description: "API de gestion des comptes bancaires"
    },
      servers: [
  {
    url: "https://api-banque.onrender.com"
  }
]
  },
  apis: ["./api.js"]
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* =========================
   ROUTE TEST
========================= */
/**
 * @swagger
 * /:
 *   get:
 *     summary: Route de test
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: API fonctionnelle
 */
app.get("/", (req, res) => {
  res.send("API bancaire opérationnelle ");
});

/* =========================
   CREER COMPTE
========================= */
/**
 * @swagger
 * /comptes:
 *   post:
 *     summary: Créer un compte bancaire
 *     tags: [Comptes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               email:
 *                 type: string
 *               soldeInitial:
 *                 type: number
 *     responses:
 *       201:
 *         description: Compte créé
 */
app.post("/comptes", (req, res) => {
  const { nom, email, soldeInitial } = req.body;

  if (!nom || !email) {
    return res.status(400).json({ message: "Nom et email requis" });
  }

  const compte = {
    id: idCounter++,
    nom,
    email,
    solde: Number(soldeInitial) || 0,
    date_creation: new Date()
  };

  comptes.push(compte);

  res.status(201).json(compte);
});

/* =========================
   LISTE COMPTES
========================= */
/**
 * @swagger
 * /comptes:
 *   get:
 *     summary: Liste des comptes
 *     tags: [Comptes]
 *     responses:
 *       200:
 *         description: Liste récupérée
 */
app.get("/comptes", (req, res) => {
  res.json(comptes);
});

/* =========================
   DEPOT
========================= */
/**
 * @swagger
 * /comptes/{id}/depot:
 *   post:
 *     summary: Dépôt d'argent
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               montant:
 *                 type: number
 *     responses:
 *       200:
 *         description: Dépôt effectué
 */
app.post("/comptes/:id/depot", (req, res) => {
  const compte = comptes.find(c => c.id == req.params.id);
  const montant = Number(req.body.montant);

  if (!compte) {
    return res.status(404).json({ message: "Compte introuvable" });
  }

  if (!montant || montant <= 0) {
    return res.status(400).json({ message: "Montant invalide" });
  }

  compte.solde += montant;

  res.json(compte);
});

/* =========================
   RETRAIT
========================= */
/**
 * @swagger
 * /comptes/{id}/retrait:
 *   post:
 *     summary: Retrait d'argent
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               montant:
 *                 type: number
 *     responses:
 *       200:
 *         description: Retrait effectué
 */
app.post("/comptes/:id/retrait", (req, res) => {
  const compte = comptes.find(c => c.id == req.params.id);
  const montant = Number(req.body.montant);

  if (!compte) {
    return res.status(404).json({ message: "Compte introuvable" });
  }

  if (!montant || montant <= 0) {
    return res.status(400).json({ message: "Montant invalide" });
  }

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