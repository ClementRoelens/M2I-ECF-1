import express, { Request, Response } from "express";
import { writeFile, readFile } from "fs/promises";
import { Dao } from "../models/Dao";
import { Project } from "../models/Project";
import crypto from "crypto";
import { resolve } from "path";

const projectRouter = express.Router();

const projectDao = new Dao("db.json");
// Variable utilisée pour la validation des données reçues en body
const anonymousProject: Project = {
    id: "",
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    status: ""
};

let logContent = "";

(async function(){
    logContent = (await readFile(resolve('log.txt'))).toString();
})();

async function writeLog(event: string) {
    const newLine = new Date().toLocaleString() + "\n" + event + "\n\n";
    logContent += newLine;
    try {
        await writeFile(resolve('log.txt'), logContent);
        console.log(newLine);
    }
    catch (err: any) {
        console.error("Problème avec l'écriture des logs");
    }
}

function typeCheck(body: any, demandedModel: Project): boolean {
    for (const key in demandedModel) {
        if (key !== "startDate" && key != "endDate") {
            if (!(key in body) || (typeof body[key] !== typeof demandedModel[key])) {
                return false;
            }
            // Gérer les dates demande un peu plus de précision
        } else {
            if (isNaN(Date.parse(body[key]))) {
                return false;
            }
        }
    }
    return true;
}

projectRouter.get("/", (req: Request, res: Response) => {
    const projects = projectDao.getProjects();
    const event = "GET projects demandé par " + req.get("Origin");
    writeLog(event);
    res.status(200).json({ projects: projects });
});

projectRouter.get("/random", (req: Request, res: Response) => {
    const event = "GET projects/random demandé par " + req.get("Origin");
    const project = projectDao.getOneRandomProject();
    if (project) {
        const eventBis = "Le projet " + project.id + " a été renvoyé";
        writeLog(event + "\n" + eventBis);
        res.status(200).json({ project });
    } else {
        const eventBis = "Mais il semble qu'il n'y ait aucun projet dans la base de données";
        writeLog(event + "\n" + eventBis);
        res.status(400).json({ message: "Aucun projet dans la base de données" });
    }
});

projectRouter.get("/:projectId", (req: Request, res: Response) => {
    const event = `GET projects/${req.params.projectId} demandé par ${req.get("Origin")}`;
    const project = projectDao.getOneProject(req.params.projectId);
    if (project) {
        writeLog(event + "\nLe projet a bien été envoyé");
        res.status(200).json({ project });
    } else {
        writeLog(event + "\nLe projet n'a pas été trouvé");
        res.status(404).json({ message: "Aucun projet ne correspond à cet id" });
    }
});


projectRouter.post("/", async (req: Request, res: Response) => {
    const event = "POST projects/ demandé par " + req.get("Origin");
    const triedBody = { ...req.body, id: crypto.randomUUID() };
    if (typeCheck(triedBody, anonymousProject) && !req.body.id) {
        const result = await projectDao.addOneProject(triedBody);
        const code = result.code;
        const returnedValue = result.result;
        if (typeof returnedValue === "string"){
            writeLog(event + "\n" + returnedValue);
        } else {
            writeLog(event + "\nProjet créé avec succès. Id : " + returnedValue.id);
        }
        res.status(code).json({ project: returnedValue });
    } else {
        let eventBis = "Mais le corps de la requête n'était pas au bon format\nCorps passé : {\n";
        for (const key in req.body){
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
});

projectRouter.put("/:projectId", async (req: Request, res: Response) => {
    const event = `PUT projects/${req.params.projectId} demandé par ${req.get("Origin")}`;
    if (typeCheck(req.body, anonymousProject)) {
        if (req.params.projectId === req.body.id) {
            const result = await projectDao.editProject(req.body);
            const code = result.code;
            const returnedValue = result.result;
            if (typeof returnedValue === "string"){
                writeLog(event + "\n" + returnedValue);
            } else {
                writeLog(event + "\nProjet modifié avec succès\n");
            }
            res.status(code).json({ project: returnedValue });
        }
        else {
            writeLog(event + "\nL'id passé ne semble pas correspondre avec celle du projet passé");
            res.status(400).json({ message: "L'id du projet que vous essayez d'éditer ne correspond pas à l'id de ce endpoint" });
        }
    } else {
        let eventBis = "Mais le corps de la requête n'était pas au bon format\nCorps passé : {\n";
        for (const key in req.body){
            eventBis += `'key' : '${key}' , \n'valeur' : '${req.body[key]}'\n}`;
        }
        writeLog(event + "\n" + eventBis);
        res.status(400).json({
            message: "L'objet que vous avez passé pour être édité ne semble pas être un projet. Pour rappel, un projet a cette structure",
            objetType: anonymousProject
        });
    }
});

projectRouter.delete("/:projectId", async (req: Request, res: Response) => {
    const event = `DELETE projects/${req.params.projectId} demandé par ${req.get("Origin")}`;
    const result = await projectDao.deleteProject(req.params.projectId);
    const code = result.code;
    const returnedValue = result.result;
    if (typeof returnedValue === "string"){
        writeLog(event + "\n" + returnedValue);
    } else {
        writeLog(event + "\nProjet supprimé avec succès\n");
    }
    res.status(code).json({ projects: returnedValue });
});

export default projectRouter;