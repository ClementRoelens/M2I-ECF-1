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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dao = void 0;
const promises_1 = require("fs/promises");
const path_1 = require("path");
class Dao {
    constructor(_filePath) {
        this._filePath = _filePath;
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stringFileContent = (yield (0, promises_1.readFile)((0, path_1.resolve)(this._filePath))).toString("utf-8");
                this._projects = JSON.parse(stringFileContent).projects;
                console.log("DB locale lue\n");
                this._logContent = (yield (0, promises_1.readFile)((0, path_1.resolve)("log.txt"))).toString();
            }
            catch (err) {
                console.error("Une erreur est survenue lors de la lecture du fichier\n", err.message);
            }
        });
    }
    updateFile() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, promises_1.writeFile)((0, path_1.resolve)(this._filePath), JSON.stringify({ projects: this._projects }));
        });
    }
    findOneProjectAndUpdateDatabase(id, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this._projects.findIndex((project) => project.id === id);
            if (index !== -1) {
                action(index);
                yield this.updateFile();
                return;
            }
            else {
                console.log("Aucun projet ne correspond à cet id\n");
                return "Aucun projet ne correspond à cet id";
            }
        });
    }
    getProjects() {
        return this._projects;
    }
    getOneProject(id) {
        return this._projects.find((project) => project.id === id);
    }
    getOneRandomProject() {
        if (this._projects.length > 0) {
            return this._projects[Math.floor(Math.random() * this._projects.length)];
        }
    }
    addOneProject(project) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._projects.push(project);
                yield this.updateFile();
                return { code: 200, result: project };
            }
            catch (err) {
                console.error("Une erreur est survenue lors de l'ajout d'un projet\n", err.message);
                return { code: 500, result: err.message };
            }
        });
    }
    editProject(editedProject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.findOneProjectAndUpdateDatabase(editedProject.id, (index) => {
                    this._projects[index] = editedProject;
                });
                if (result) {
                    return { code: 404, result: result };
                }
                else {
                    return { code: 200, result: editedProject };
                }
            }
            catch (err) {
                console.error(`Une erreur est survenue lors de l'édition du projet ${editedProject.id}\n`, err.message);
                return { code: 500, result: err.message };
            }
        });
    }
    deleteProject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.findOneProjectAndUpdateDatabase(id, (index) => {
                    this._projects.splice(index, 1);
                });
                if (result) {
                    return { code: 404, result: result };
                }
                else {
                    return { code: 200, result: this._projects };
                }
            }
            catch (err) {
                console.error(`Une erreur est survenue lors de la suppression du projet ${id}\n`, err.message);
                return { code: 500, result: err.message };
            }
        });
    }
}
exports.Dao = Dao;
//# sourceMappingURL=Dao.js.map