const axios = require("axios");

("use strict");
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };

Object.defineProperty(exports, "__esModule", { value: true });
const whatsapp_web_js_1 = require("whatsapp-web.js");
const { Buttons } = require("whatsapp-web.js");
const qr_image_1 = require("qr-image");
const { text } = require("express");

/**
 * Extendemos los super poderes de whatsapp-web
 */

const LaravelUrl = "http://127.0.0.1:8000/api/";
class WsTransporter extends whatsapp_web_js_1.Client {
  constructor() {
    super({
      authStrategy: new whatsapp_web_js_1.LocalAuth(),
      puppeteer: { headless: true },
    });
    this.status = false;
    this.generateImage = (base64) => {
      const path = `${process.cwd()}/tmp`;
      let qr_svg = (0, qr_image_1.image)(base64, { type: "svg", margin: 4 });
      qr_svg.pipe(require("fs").createWriteStream(`${path}/qr.svg`));
      console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
      console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR⚡`);
    };
    console.log("Iniciando....");
    this.initialize();
    this.on("ready", () => {
      this.status = true;
      console.clear();
      console.log("LOGIN_SUCCESS");
    });
    this.on("auth_failure", () => {
      this.status = false;
      console.log("LOGIN_FAIL");
    });
    this.on("qr", (qr) => {
      console.log("Escanea el codigo QR que esta en la carepta tmp");
      this.generateImage(qr);
    });
    this.on("message", async (msg) => {
      // Importante identificador de id
      const { from, body, hasMedia, type, selectedButtonId } = msg;
      const _type = type.toLowerCase();

      //==================== Tecnico ====================
      if (msg.body.includes("Atender")) {
        if (_type == "buttons_response") {
          msg.react("👍");
          var idBotton = selectedButtonId;
          this.sendMessage(
            msg.from,
            "*Entendido 🤖🫡* \n\nSe va a reportar la novedad al cliente y se va a agendar un visita\n\nEstaremos en contacto 😁👍"
          );
          this.cambiarEstado(idBotton);
        }
      } else if (msg.body.includes("Rechazar")) {
        if (_type == "buttons_response") {
          msg.react("👍");
          var idBotton = selectedButtonId;
          this.sendMessage(
            msg.from,
            "*Entendido 🤖🫡* \n\nEl registro fue rechazado \n\nGracias por su tiempo 🤖, Estaremos en contacto 😁👍"
          );
          this.cambiarRechazado(idBotton);
        }

        //==================== Comprobación del cliente ====================
      } else if (msg.body.includes("Aprobar")) {
        if (_type == "buttons_response") {
          msg.react("🤖");
          var idBotton = selectedButtonId;
          this.sendMessage(
            msg.from,
            "Listo🤖 \nSe ha confirmó el registro con éxito. \n\nEstaremos en contacto para informar las novedades de tu UPS 👍 \n\nGracias por su tiempo 🤖👋"
          );
          this.cambiarCli(idBotton);
        }
      } else if (msg.body.includes("Denegar")) {
        if (_type == "buttons_response") {
          var idBotton = selectedButtonId;
          this.sendMessage(
            msg.from,
            "Listo🤖 \nHas denegado el Registro. \n\nGracias por su tiempo 🤖👋"
          );
          this.cambiarCli(idBotton);
        }
      } else if ((msg.body = "Si")) {
        if (_type == "buttons_response") {
          var idBotton = selectedButtonId;
          this.sendMessage(
            msg.from,
            "Listo 🫡🤖 \nSe agendó la cita correctamente. \n\nGracias por su tiempo 🤖👋"
          );
          this.siCli(idBotton);
        } else if ((msg.body = "No")) {
          if (_type == "buttons_response") {
            var idBotton = selectedButtonId;
            this.sendMessage(
              msg.from,
              "Listo 🫡🤖 \nSe va a corregir la fecha y hora de la visita. \n\nGracias por su tiempo 🤖👋"
            );
            this.cambiarRechazado(idBotton);
          }
        } else if (msg.body === "👍" || msg.body === "👍🏻") {
          msg.reply("👍");
        }
      }
      console.log(`Mensaje Enviado ✉️ 🤖 al número ${msg.from}`);
    });
  }

  /**
   * Enviar mensaje de WS
   * @param lead
   * @returns
   */

  sendMsg(lead) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (!this.status) return Promise.resolve({ error: "WAIT_LOGIN" });
        const { message, phone, idP, Tipo, idA } = lead;

        if (Tipo === "Tecnico") {
          let button = new Buttons(
            message,
            [
              { id: idP, body: "Atender" },
              { id: idA, body: "Rechazar" },
            ],
            "Alerta 🤖",
            "recuerda escoger solo una opción para que el proceso sea mas ágil 😉"
          );
          const response = yield this.sendMessage(`${phone}@c.us`, button);
        } else if (Tipo === "Cliente") {
          const response = yield this.sendMessage(`${phone}@c.us`, message);
        } else if (Tipo === "ClientePri") {
          let button = new Buttons(
            message,
            [
              { id: idA, body: "Aprobar" },
              { id: idP, body: "Denegar" },
            ],
            "Hola soy Chat bot asistente virtual🤖",
            "Gracias"
          );
          const response = yield this.sendMessage(`${phone}@c.us`, button);
        } else if (Tipo === "horarioCli") {
          let button = new Buttons(
            message,
            [
              { id: idA, body: "Si" },
              { id: idP, body: "No" },
            ],
            "Hola soy Chat bot asistente virtual🤖",
            "Gracias"
          );
          const response = yield this.sendMessage(`${phone}@c.us`, button);
        }

        return { id: response.id.id };
      } catch (e) {
        return Promise.resolve({ error: e.message });
      }
    });
  }

  // ================== Cambiar estado api Laravel ===============

  async cambiarEstado(id) {
    var config = {
      method: "put",
      maxBodyLength: Infinity,
      url: LaravelUrl + "reporte/" + id,
      headers: {},
    };
    axios(config)
      .then(function (response) {
        console.log("Bien");
      })
      .catch(function (error) {
        console.log("mal");
      });
  }
  async cambiarCli(id) {
    var config = {
      method: "put",
      maxBodyLength: Infinity,
      url: LaravelUrl + "clienteAceptar/" + id,
      headers: {},
    };
    axios(config)
      .then(function (response) {
        console.log("Bien");
      })
      .catch(function (error) {
        console.log("mal");
      });
  }

  async siCli(id) {
    var config = {
      method: "put",
      maxBodyLength: Infinity,
      url: LaravelUrl + "siCli/" + id,
      headers: {},
    };
    axios(config)
    .then(function (response) {
      console.log("Bien");
    })
    .catch(function (error) {
      console.log("mal");
    });
  }

  async cambiarRechazado(id) {
    var config = {
      method: "put",
      maxBodyLength: Infinity,
      url: LaravelUrl + "reporteRechazado/" + id,
      headers: {},
    };
    axios(config)
      .then(function (response) {
        console.log("Bien");
      })
      .catch(function (error) {
        console.log("mal");
      });
  }
  getStatus() {
    return this.status;
  }

  //==============Funciones automaticas=================
  mensajeDinamico(texto, opciones) {
    let button = new Buttons(
      texto,
      opciones,
      "Info 🤖",
      "Esta parte es Editable"
    );
    return button;
  }
  mensajeDinamicoTexto(texto) {
    let button = new Buttons(texto, null, "Info 🤖", "Esta parte es Editable");
    return button;
  }
  insertarAgenda(fecha, horaInicio, jornada, idNovedad) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      fecha: fecha,
      horaInicio: horaInicio,
      jornada: jornada,
      idNovedad: idNovedad,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch("https://proups.sodeker.com/api/insertarCitaUps", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }
}

exports.default = WsTransporter;
