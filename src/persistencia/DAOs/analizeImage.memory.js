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
    const textFormated = text.join("\n");
    const numeroFacturaRegex = /Nro:\s*([0-9-]+)/i;
    const nombreEmpresaRegex = /Sres\s*\.:\s*([^\n]+)/i;
    const tipoFacturaRegex = /Factura\s+de\s+Venta\s+(\w+)/i;
    const fechaRegex = /Fecha:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i;

    const numeroFactura = textFormated.match(numeroFacturaRegex);
    const nombreEmpresa = textFormated.match(nombreEmpresaRegex);
    const tipoFactura = textFormated.match(tipoFacturaRegex);
    const fecha = textFormated.match(fechaRegex);

    return {
      numeroFactura: numeroFactura ? numeroFactura[1] : null,
      nombreEmpresa: nombreEmpresa ? nombreEmpresa[1] : null,
      tipoFactura: tipoFactura ? tipoFactura[1] : null,
      fecha: fecha ? fecha[1] : null,
      totalAmount: this.extractTotalAmount(text),
    };
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

const analizeImage = new AnalizeImageManager();
module.exports = analizeImage;
