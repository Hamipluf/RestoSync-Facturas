const ComputerVisionClient =
  require("@azure/cognitiveservices-computervision").ComputerVisionClient;
const ApiKeyCredentials = require("@azure/ms-rest-js").ApiKeyCredentials;
// DotEnv
const dotenv = require("dotenv");
const key = process.env.VISION_KEY;
const endpoint = process.env.VISION_ENDPOINT;
// Manager
const analizeImageManager = require("../persistencia/DAOs/analizeImage.memory");
// Custom Responses
const customResponses = require("../../utils/customResponse");

const data = [];

async function extractText(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res
        .status(400)
        .json({ error: "Se requiere una URL de imagen válida" });
    }

    const readText = await analizeImageManager.readText(url);
    if (readText.error) {
      return res
        .status(400)
        .json(customResponses.badResponse(400, readText.message));
    } else {
      return res
        .status(200)
        .json(customResponses.responseOk(200, "Texto extraido", readText));
    }
  } catch (err) {
    console.error("Error al extraer texto:", err);

    if (err.statusCode && err.message) {
      return res.status(err.statusCode).json({ error: err.message });
    } else {
      return res
        .status(500)
        .json({ error: "Ocurrió un error al procesar la solicitud" });
    }
  }
}
async function extratAllData(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res
        .status(400)
        .json({ error: "Se requiere una URL de imagen válida" });
    }

    const text = await analizeImageManager.readText(url);
    if (text.error) {
      return res
        .status(400)
        .json(customResponses.badResponse(400, text.message));
    }
    const data = analizeImageManager.extractData(text);
    res.json(data);
  } catch (err) {
    console.error("Error al extraer texto:", err);

    if (err.statusCode && err.message) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res
        .status(500)
        .json({ error: "Ocurrió un error al procesar la solicitud" });
    }
  }
}
async function extractTotal(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res
        .status(400)
        .json({ error: "Se requiere una URL de imagen válida" });
    }

    const text = await analizeImageManager.readText(url);
    if (text.error) {
      return res
        .status(400)
        .json(customResponses.badResponse(400, text.message));
    }
    const total = await analizeImageManager.extractTotalAmount(text);
    res.json(total);

  } catch (err) {
    console.error("Error al extraer texto:", err);

    if (err.statusCode && err.message) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res
        .status(500)
        .json({ error: "Ocurrió un error al procesar la solicitud" });
    }
  }
}

module.exports = {
  extractText,
  extractTotal,
  extratAllData,
};
