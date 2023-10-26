import express, { Request, Response } from "express";
import { Dao } from "../models/Dao";
import { Project } from "../models/Project";
import crypto from "crypto";

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

function typeCheck(body: any, demandedModel: Project): boolean {
    for (const key in demandedModel) {
        if (key !== "startDate" && key != "endDate") {
            if (!(key in body) || (typeof body[key] !== typeof demandedModel[key])) {
                return false;
            }
            // Gérer les dates demande un peu plus de précision
        } else {
            if (isNaN(Date.parse(body[key]))){
                return false;
            }
        }
    }
    return true;
}

projectRouter.get("/", (req: Request, res: Response) => {
    const projects = projectDao.getProjects();
    res.status(200).json({ projects: projects });
});

projectRouter.get("/:projectId", (req: Request, res: Response) => {
    const project = projectDao.getOneProject(req.params.projectId);
    if (project) {
        res.status(200).json({ project: project });
    } else {
        res.status(404).json({ message: "Aucun projet ne correspond à cet id" });
    }
});

projectRouter.post("/", async (req: Request, res: Response) => {
    const triedBody = { ...req.body, id: crypto.randomUUID() };
    if (typeCheck(triedBody, anonymousProject) && !req.body.id ) {
        const result = await projectDao.addOneProject(triedBody);
        const code = result.code;
        const returnedValue = result.result;
        res.status(code).json({ returnedValue });
    } else {
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
    if (typeCheck(req.body, anonymousProject)) {
        if (req.params.projectId === req.body.id) {
            const result = await projectDao.editProject(req.body);
            const code = result.code;
            const returnedValue = result.result;
            res.status(code).json({ returnedValue });
        }
        else {
            res.status(400).json({ message: "L'id du projet que vous essayez d'éditer ne correspond pas à l'id de ce endpoint" });
        }
    } else {
        res.status(400).json({
            message: "L'objet que vous avez passé pour être édité ne semble pas être un projet. Pour rappel, un projet a cette structure",
            objetType: anonymousProject
        });
    }
});

projectRouter.delete("/:projectId", async (req: Request, res: Response) => {
    const result = await projectDao.deleteProject(req.params.projectId);
    const code = result.code;
    const returnedValue = result.result;
    res.status(code).json({ returnedValue });
});

export default projectRouter;