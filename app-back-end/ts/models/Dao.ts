import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { Project } from "./Project";

export class Dao {
    private _projects: Project[];
    private _logContent:string;

    constructor(private _filePath: string) {
        this.initialize();
    }

    async initialize() {
        try {
            const stringFileContent = (await readFile(resolve(this._filePath))).toString("utf-8");
            this._projects = JSON.parse(stringFileContent).projects;
            console.log("DB locale lue\n");
            this._logContent = (await readFile(resolve("log.txt"))).toString();
        }
        catch (err: any) {
            console.error("Une erreur est survenue lors de la lecture du fichier\n", err.message);
        }
    }

    async updateFile() {
        await writeFile(resolve(this._filePath), JSON.stringify({ projects: this._projects }));
    }

    async findOneProjectAndUpdateDatabase(id: string, action: (index: number) => void): Promise<string | undefined> {
        const index = this._projects.findIndex((project: Project) => project.id === id);
        if (index !== -1) {
            action(index);
            await this.updateFile();
            return;
        } else {
            console.log("Aucun projet ne correspond à cet id\n");
            return "Aucun projet ne correspond à cet id";
        }
    }

    getProjects(): Project[] {
        return this._projects;
    }

    getOneProject(id: string): Project | undefined {
        return this._projects.find((project: Project) => project.id === id);
    }

    getOneRandomProject() : Project | undefined {
        if (this._projects.length > 0){
            return this._projects[Math.floor(Math.random()*this._projects.length)];
        }
    }

    async addOneProject(project: Project): Promise<{ code: number, result: Project | string }> {
        try {
            this._projects.push(project);
            await this.updateFile();
            return { code: 200, result: project };
        }
        catch (err: any) {
            console.error("Une erreur est survenue lors de l'ajout d'un projet\n", err.message);
            return { code: 500, result: err.message };
        }
    }

    async editProject(editedProject: Project): Promise<{ code: number, result: Project | string }> {
        try {
            const result = await this.findOneProjectAndUpdateDatabase(editedProject.id, (index: number) => {
                this._projects[index] = editedProject;
            })
            if (result) {
                return { code: 404, result: result };
            } else {
                return { code: 200, result: editedProject };
            }
        }
        catch (err: any) {
            console.error(`Une erreur est survenue lors de l'édition du projet ${editedProject.id}\n`, err.message);
            return { code: 500, result: err.message };
        }
    }

    async deleteProject(id: string): Promise<{ code: number, result: Project[] | string }> {
        try {
            const result = await this.findOneProjectAndUpdateDatabase(id, (index: number) => {
                this._projects.splice(index, 1);
            })
            if (result) {
                return { code: 404, result: result };
            } else {
                return { code: 200, result: this._projects };
            }
        }
        catch (err: any) {
            console.error(`Une erreur est survenue lors de la suppression du projet ${id}\n`, err.message);
            return { code: 500, result: err.message };
        }
    }
}