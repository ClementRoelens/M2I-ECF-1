"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promises_1 = require("fs/promises");
const Dao_1 = require("../models/Dao");
const crypto_1 = __importDefault(require("crypto"));
const path_1 = require("path");
const projectRouter = express_1.default.Router();
const projectDao = new Dao_1.Dao("db.json");
// Variable utilisée pour la validation des données reçues en body
const anonymousProject = {
    id: "",
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    status: ""
};
let logContent = "";
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        logContent = (yield (0, promises_1.readFile)((0, path_1.resolve)('log.txt'))).toString();
    });
})();
function writeLog(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const newLine = new Date().toLocaleString() + "\n" + event + "\n\n";
        logContent += newLine;
        try {
            yield (0, promises_1.writeFile)((0, path_1.resolve)('log.txt'), logContent);
            console.log(newLine);
        }
        catch (err) {
            console.error("Problème avec l'écriture des logs");
        }
    });
}
function typeCheck(body, demandedModel) {
    for (const key in demandedModel) {
        if (key !== "startDate" && key != "endDate") {
            if (!(key in body) || (typeof body[key] !== typeof demandedModel[key])) {
                return false;
            }
            // Gérer les dates demande un peu plus de précision
        }
        else {
            if (isNaN(Date.parse(body[key]))) {
                return false;
            }
        }
    }
    return true;
}
projectRouter.get("/", (req, res) => {
    const projects = projectDao.getProjects();
    const event = "GET projects demandé par " + req.get("Origin");
    writeLog(event);
    res.status(200).json({ projects: projects });
});
projectRouter.get("/random", (req, res) => {
    const event = "GET projects/random demandé par " + req.get("Origin");
    const project = projectDao.getOneRandomProject();
    if (project) {
        const eventBis = "Le projet " + project.id + " a été renvoyé";
        writeLog(event + "\n" + eventBis);
        res.status(200).json({ project });
    }
    else {
        const eventBis = "Mais il semble qu'il n'y ait aucun projet dans la base de données";
        writeLog(event + "\n" + eventBis);
        res.status(400).json({ message: "Aucun projet dans la base de données" });
    }
});
projectRouter.get("/:projectId", (req, res) => {
    const event = `GET projects/${req.params.projectId} demandé par ${req.get("Origin")}`;
    const project = projectDao.getOneProject(req.params.projectId);
    if (project) {
        writeLog(event + "\nLe projet a bien été envoyé");
        res.status(200).json({ project });
    }
    else {
        writeLog(event + "\nLe projet n'a pas été trouvé");
        res.status(404).json({ message: "Aucun projet ne correspond à cet id" });
    }
});
projectRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const event = "POST projects/ demandé par " + req.get("Origin");
    const triedBody = Object.assign(Object.assign({}, req.body), { id: crypto_1.default.randomUUID() });
    if (typeCheck(triedBody, anonymousProject) && !req.body.id) {
        const result = yield projectDao.addOneProject(triedBody);
        const code = result.code;
        const returnedValue = result.result;
        if (typeof returnedValue === "string") {
            writeLog(event + "\n" + returnedValue);
        }
        else {
            writeLog(event + "\nProjet créé avec succès. Id : " + returnedValue.id);
        }
        res.status(code).json({ project: returnedValue });
    }
    else {
        let eventBis = "Mais le corps de la requête n'était pas au bon format\nCorps passé : {\n";
        for (const key in req.body) {
            eventBis += `'key' : '${key}' , \n'valeur' : '${req.body[key]}'\n}`;
        }
        writeLog(event + "\n" + eventBis);
        res.status(400).json({
            message: "L'objet que vous avez passé ne semble pas être un projet. Pour rappel, un projet a cette structure",
            objetType: {
                title: "Titre",
                description: "Description",
                startDate: "année-mois-jour",
                endDate: "année-mois-jour",
                status: "Statut"
            }
        });
    }
}));
projectRouter.put("/:projectId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const event = `PUT projects/${req.params.projectId} demandé par ${req.get("Origin")}`;
    if (typeCheck(req.body, anonymousProject)) {
        if (req.params.projectId === req.body.id) {
            const result = yield projectDao.editProject(req.body);
            const code = result.code;
            const returnedValue = result.result;
            if (typeof returnedValue === "string") {
                writeLog(event + "\n" + returnedValue);
            }
            else {
                writeLog(event + "\nProjet modifié avec succès\n");
            }
            res.status(code).json({ project: returnedValue });
        }
        else {
            writeLog(event + "\nL'id passé ne semble pas correspondre avec celle du projet passé");
            res.status(400).json({ message: "L'id du projet que vous essayez d'éditer ne correspond pas à l'id de ce endpoint" });
        }
    }
    else {
        let eventBis = "Mais le corps de la requête n'était pas au bon format\nCorps passé : {\n";
        for (const key in req.body) {
            eventBis += `'key' : '${key}' , \n'valeur' : '${req.body[key]}'\n}`;
        }
        writeLog(event + "\n" + eventBis);
        res.status(400).json({
            message: "L'objet que vous avez passé pour être édité ne semble pas être un projet. Pour rappel, un projet a cette structure",
            objetType: anonymousProject
        });
    }
}));
projectRouter.delete("/:projectId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const event = `DELETE projects/${req.params.projectId} demandé par ${req.get("Origin")}`;
    const result = yield projectDao.deleteProject(req.params.projectId);
    const code = result.code;
    const returnedValue = result.result;
    if (typeof returnedValue === "string") {
        writeLog(event + "\n" + returnedValue);
    }
    else {
        writeLog(event + "\nProjet supprimé avec succès\n");
    }
    res.status(code).json({ projects: returnedValue });
}));
exports.default = projectRouter;
//# sourceMappingURL=project.route.js.map