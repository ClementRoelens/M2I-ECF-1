import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../config/hooks";
import { Project } from "../models/Project";
import ProjectThumb from "./ProjectThumb";

function ProjectList() {
    const projects = useAppSelector(state => state.projects.projects);
    const [selectedProjects,setSelectedProjects] = useState<Project[]>([]);
    const noFilterRef = useRef() as React.MutableRefObject<HTMLOptionElement>;
    const noneOptionRef = useRef() as React.MutableRefObject<HTMLOptionElement>;
    const pendingOptionRef = useRef() as React.MutableRefObject<HTMLOptionElement>;
    const waitingOptionRef = useRef() as React.MutableRefObject<HTMLOptionElement>;
    const completedOptionRef = useRef() as React.MutableRefObject<HTMLOptionElement>;
    
    useEffect(() => {
        setSelectedProjects(projects);
    },[projects])

    function select(){
        console.log("fonction select lancée");
        switch (true) {
            case noFilterRef.current.selected:
                setSelectedProjects(projects);
                break;
            case noneOptionRef.current.selected:
                setSelectedProjects(projects.filter((project:Project) => project.status === "Non débutée"));
                break;
            case pendingOptionRef.current.selected:
                setSelectedProjects(projects.filter((project:Project) => project.status === "En cours"));
                break;
            case waitingOptionRef.current.selected:
                setSelectedProjects(projects.filter((project:Project) => project.status === "En attente"));
                break;
            case completedOptionRef.current.selected:
                setSelectedProjects(projects.filter((project:Project) => project.status === "Terminée"));
                break;
        }
    }

    return (<>
    <div className="ms-auto col-3">
        <select className="form-select ms-auto col-3" onChange={select}>
            <option value="Pas de filtre" ref={noFilterRef}>Pas de filtre</option>
            <option value="Non débutée" ref={noneOptionRef}>Non débutée</option>
            <option value="En cours" ref={pendingOptionRef}>En cours</option>
            <option value="En attente" ref={waitingOptionRef}>En attente</option>
            <option value="Terminée" ref={completedOptionRef}>Terminée</option>
        </select>
    </div>
        <ul className="p-0">
            {selectedProjects.map((project: Project) => <ProjectThumb project={project} key={project.id} />)}
        </ul>
    </>);
}

export default ProjectList;