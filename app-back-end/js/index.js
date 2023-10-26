"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_route_1 = __importDefault(require("./routes/project.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/projects", project_route_1.default);
app.listen(3000, () => {
    console.log("\nServeur écoutant sur 3000, prêt à recevoir des requêtes !\n");
});
//# sourceMappingURL=index.js.map