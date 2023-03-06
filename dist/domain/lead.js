"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = void 0;
const uuid_1 = require("uuid");
class Lead {
    constructor({ message, phone, idP, Tipo, idA }) {
        this.uuid = (0, uuid_1.v4)();
        this.message = message;
        this.phone = phone;
        this.idP = idP;
        this.Tipo = Tipo;
        this.idA = idA;
    }
}
exports.Lead = Lead;
