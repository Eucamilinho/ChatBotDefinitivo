import express, { Router } from "express";
import LeadCtrl from "../controller/lead.ctrl";
import container from "../ioc";
const router: Router = Router();

/**
 * http://localhost/lead POST
 */
const leadCtrl: LeadCtrl = container.get("lead.ctrl");
router.post("/", leadCtrl.sendCtrl);

export { router };
/**
 * Explicación: el código se refactorizó para 
 * mover la línea de código que crea una 
 * instancia del objeto LeadCtrl fuera del 
 * método de publicación del enrutador, 
 * de modo que solo se crea una instancia una 
 * vez en lugar de cada vez que se llama al 
 * método de publicación.
 */