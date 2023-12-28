// Router
const { Router } = require("express");
// Controllers
const {
  extractText,
  extractTotal,
  extratAllData,
} = require("../controllers/extractText.controller.js");

const router = Router();

// Leer el texto de imagenes/pdf
router.post("/read-text", extractText);
router.post("/total", extractTotal);
router.post("/data", extratAllData);

module.exports = router;
