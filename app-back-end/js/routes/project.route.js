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
const Dao_1 = require("../models/Dao");
const crypto_1 = __importDefault(require("crypto"));
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
    res.status(200).json({ projects: projects });
});
projectRouter.get("/:projectId", (req, res) => {
    const project = projectDao.getOneProject(req.params.projectId);
    if (project) {
        res.status(200).json({ project: project });
    }
    else {
        res.status(404).json({ message: "Aucun projet ne correspond à cet id" });
    }
});
projectRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const triedBody = Object.assign(Object.assign({}, req.body), { id: crypto_1.default.randomUUID() });
    if (typeCheck(triedBody, anonymousProject) && !req.body.id) {
        const result = yield projectDao.addOneProject(triedBody);
        const code = result.code;
        const returnedValue = result.result;
        res.status(code).json({ returnedValue });
    }
    else {
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
    if (typeCheck(req.body, anonymousProject)) {
        if (req.params.projectId === req.body.id) {
            const result = yield projectDao.editProject(req.body);
            const code = result.code;
            const returnedValue = result.result;
            res.status(code).json({ returnedValue });
        }
        else {
            res.status(400).json({ message: "L'id du projet que vous essayez d'éditer ne correspond pas à l'id de ce endpoint" });
        }
    }
    else {
        res.status(400).json({
            message: "L'objet que vous avez passé pour être édité ne semble pas être un projet. Pour rappel, un projet a cette structure",
            objetType: anonymousProject
        });
    }
}));
projectRouter.delete("/:projectId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield projectDao.deleteProject(req.params.projectId);
    const code = result.code;
    const returnedValue = result.result;
    res.status(code).json({ returnedValue });
}));
exports.default = projectRouter;
//# sourceMappingURL=project.route.js.map