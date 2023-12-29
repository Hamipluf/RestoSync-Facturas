const {
  ComputerVisionClient,
} = require("@azure/cognitiveservices-computervision");
const { ApiKeyCredentials } = require("@azure/ms-rest-js");

class AnalizeImageManager {
  constructor() {
    const key = process.env.VISION_KEY;
    const endpoint = process.env.VISION_ENDPOINT;

    this.computerVisionClient = new ComputerVisionClient(
      new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
      endpoint
    );
  }

  async readText(imageUrl) {
    const result = await this._readTextFromURL(imageUrl);
    if (result && result.status === "succeeded") {
      const extractedText = result.analyzeResult.readResults[0].lines.map(
        (elem) => elem.text
      );
      if (extractedText.length < 1) {
        return {
          error: true,
          message: "Imagen de  baja calidad",
        };
      } else {
        return extractedText;
      }
    }
    return { error: true, message: "No se pudo extraer texto de la imagen" };
  }
  extractTotalAmount(text) {
    const textFormated = text.join(" ");
    const totalAmountRegex =
      /total\s*:?(\s*usd\s*)?\$?\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/i;

    const match = textFormated.match(totalAmountRegex);
    return match ? match[0] : null;
  }
  async _readTextFromURL(url) {
    let result = await this.computerVisionClient.read(url, { language: "es" });
    let operation = result.operationLocation.split("/").slice(-1)[0];

    while (result.status !== "succeeded") {
      await this.sleep(1000);
      result = await this.computerVisionClient.getReadResult(operation);
    }

    return result;
  }
  extractData(text) {
    console.log(text.join(" "))
    const blancaluna =
      "GRUPO BLANCALUNA A Factura de Venta A Codigo 01 ORIGINAL Nro: 0015-00275575 Fecha: 27/12/2023 Bidfood My Bidfood Casa Central: Humberto Primo 133 - Piso 8 C.A.B.A. - CP (C1103ACC) - ( (+54) 011-7079-4555 Distribuidora Blancaluna SA Centro Distribución: Juan Domingo Perón 3780 - Gral. Pacheco - CP (1617) IVA Responsable Inscripto Sucursal Puerto Iguazú: Feliz Bogado y Soberanía Nacional S/N Zona Industrial - CP (3370) Cuit: 30-69017223-9 ( (+54) 011-7079-4555 Int. 285 - (+54) 3757-577774 / 3757-331007 Ingresos Brutos: 901-190388-7 www.blancaluna.com.ar // www.mybidfood.com.ar Inicio de Actividades: 01/02/1997"
    7;

    const indexes = blancaluna
      .split("")
      .map((elem, index) => `${elem}: ${index}`);
    return indexes;
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

const analizeImage = new AnalizeImageManager();
module.exports = analizeImage;
