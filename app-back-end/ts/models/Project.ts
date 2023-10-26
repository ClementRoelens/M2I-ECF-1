export interface Project {
    id:string;
    title:string;
    description:string;
    startDate:Date;
    endDate:Date;
    // Faire une enum si le temps
    status:string;
}