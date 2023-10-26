"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_route_1 = __importDefault(require("./routes/project.route"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/projects", project_route_1.default);
app.use("/teatime", (req, res) => {
    res.status(418).json({
        summary: "L'histoire du thé est une épopée fascinante qui remonte à des millénaires. Voici un résumé de son parcours, en mettant l'accent sur son rôle emblématique en Angleterre avec le rituel du 'teatime'.",
        origins: "Le thé est originaire de la Chine, où ses premières traces remontent à plus de 4 000 ans. Il était consommé principalement pour ses propriétés médicinales. Au fil des siècles, le thé s'est répandu en Asie, devenant un élément clé de la culture chinoise, japonaise, et plus tard, tibétaine.",
        teaInEuropa: "Le thé a été introduit en Europe au XVIe siècle grâce aux échanges commerciaux entre l'Europe et l'Asie. Les premiers pays à l'adopter furent le Portugal et les Pays-Bas. Cependant, son coût élevé en a fait une boisson de luxe réservée à l'aristocratie.",
        indiaRole: "Au XVIIe siècle, la Compagnie des Indes orientales, une entreprise britannique, a commencé à importer massivement du thé d'Asie. Cela a rendu le thé plus abordable pour la population britannique, et il a gagné en popularité",
        teaTime: "Le rituel du 'teatime' a pris forme en Angleterre au XVIIIe siècle, à l'époque de la reine Anne. Anna, qui était une grande amatrice de thé, a contribué à populariser la coutume de boire du thé l'après-midi. Le 'teatime' est devenu un moment social important, où les familles et les amis se réunissaient pour déguster du thé, des petits gâteaux, et des sandwiches.",
        porcelain: "L'engouement pour le thé a également donné naissance à une industrie de la porcelaine et des services à thé, avec des tasses et des théières élégantes devenant des objets de collection prisés.",
        britannicCulture: "Le thé est devenu une boisson emblématique en Angleterre, faisant partie intégrante de la culture britannique. L'heure du thé de l'après-midi reste un moment privilégié pour de nombreuses personnes, avec des traditions comme le 'five o'clock tea' qui perdurent.",
        britannicHistory: "Le thé a même joué un rôle dans l'histoire britannique, notamment avec l'Acte sur le thé de 1773, qui a conduit à la Boston Tea Party aux États-Unis, un événement majeur dans le contexte de la révolution américaine.",
        secondSummary: "En résumé, l'histoire du thé est une histoire d'exploration, de commerce, de culture et de traditions qui a transformé une boisson asiatique en un élément central de la culture britannique avec le rituel du 'teatime'. Le thé a laissé une empreinte durable dans l'histoire mondiale et continue d'être apprécié par des millions de personnes à travers le monde.",
        secondBreakfast: null
    });
});
app.listen(3000, () => {
    console.log("\nServeur écoutant sur 3000, prêt à recevoir des requêtes !\n");
});
//# sourceMappingURL=index.js.map