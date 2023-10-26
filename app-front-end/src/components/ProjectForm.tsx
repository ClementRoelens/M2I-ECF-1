import { FormEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../config/hooks";
import { addProject, editProject, getOneProject } from "./projectSlice";
import { Project } from "../models/Project";
import { Alert } from "antd";
import { useNavigate, useParams } from "react-router-dom";

function ProjectForm() {
    const [isFailed, setIsFailed] = useState(false);
    const [isNotFound, setIsNotFound] = useState(false);
    const project = useAppSelector(state => state.projects.selectedProject);

    const titleRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const descriptionRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
    const startDateRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const endDateRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const noneOptionRef = useRef() as React.MutableRefObject<HTMLOptionElement>;
    const pendingOptionRef = useRef() as React.MutableRefObject<HTMLOptionElement>;
    const waitingOptionRef = useRef() as React.MutableRefObject<HTMLOptionElement>;
    const completedOptionRef = useRef() as React.MutableRefObject<HTMLOptionElement>;

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const { id } = useParams();

    useEffect(() => {
        if (id) {
            getProjectAndCheck();
        }
    }, [id])

    async function getProjectAndCheck() {
        await dispatch(getOneProject(id!));
        if (!project) {
            setIsNotFound(true);
            setTimeout(() => {
                navigate("/");
            }, 2500);
        } else {
            titleRef.current.defaultValue = project.title;
            descriptionRef.current.defaultValue = project.description;
            startDateRef.current.defaultValue = new Date(project.startDate).toISOString().split('T')[0];
            endDateRef.current.defaultValue = new Date(project.endDate).toISOString().split('T')[0];
            switch (project.status) {
                case "Non débutée":
                    noneOptionRef.current.selected = true;
                    break;
                case "En cours":
                    pendingOptionRef.current.selected = true;
                    break;
                case "En attente":
                    waitingOptionRef.current.selected = true;
                    break;
                case "Terminée":
                    completedOptionRef.current.selected = true;
                    break;
            }
        }
    }

    async function submitHandler(e: FormEvent) {
        e.preventDefault();
        if (titleRef.current.value.trim() !== "" &&
            descriptionRef.current.value.trim() !== "" &&
            startDateRef.current.value.trim() !== "" &&
            endDateRef.current.value.trim() !== ""
        ) {
            const newProject: Project = {
                title: titleRef.current.value,
                description: descriptionRef.current.value,
                startDate: new Date(startDateRef.current.value),
                endDate: new Date(endDateRef.current.value),
                status: "Non débutée"
            };
            let result: any;
            // Si pas d'id ou de project, alors on est en mode création
            console.log("testons si on a un projet");
            if (!id || !project) {
                result = await dispatch(addProject(newProject)) as any;
            }
            // Sinon, on est en mode édition
            else {
                // Et il faut modifier le statut selon ce qui a été sélectionné
                switch (true) {
                    case noneOptionRef.current.selected:
                        newProject.status = "Non débutée";
                        break;
                    case pendingOptionRef.current.selected:
                        newProject.status = "En cours";
                        break;
                    case waitingOptionRef.current.selected:
                        newProject.status = "En attente";
                        break;
                    case completedOptionRef.current.selected:
                        newProject.status = "Terminée";
                        break;
                }
                // Et aussi rajouter l'id
                newProject.id = id;
                result = await dispatch(editProject({ project: newProject, id: id! }))
            }
            if (result.error) {
                setIsFailed(true);
            } else {
                navigate("/");
            }
        }
    }

    return (
        <>
            {isFailed && <Alert type="error" message="Erreur" description="Une erreur est survenue" />}
            {isNotFound && <Alert type="error" message="Erreur" description="Aucun projet trouvé pour cet id" />}
            {!isNotFound &&
                <form action="" onSubmit={submitHandler}>
                    <div className="mt-3 mb-2">
                        <label htmlFor="title" className="form-label">Titre : </label>
                        <input type="text" className="form-control" id="title" ref={titleRef} required />
                    </div>
                    <div className="mt-3 mb-2">
                        <label htmlFor="description" className="form-label">Description : </label>
                        <textarea className="form-control" id="description" ref={descriptionRef} required></textarea>
                    </div>
                    <div className="mt-3 mb-2">
                        <label htmlFor="startDate" className="form-label">Début : </label>
                        <input type="date" className="form-control" id="startDate" ref={startDateRef} required />
                    </div>
                    <div className="mt-3 mb-2">
                        <label htmlFor="endDate" className="form-label">Fin : </label>
                        <input type="date" className="form-control" id="endDate" ref={endDateRef} required />
                    </div>
                    {id && project &&
                        <div>
                            <label htmlFor="status" className="form-label">Statut : </label>
                            <select id="status" className="form-select">
                                <option value="Non débutée" ref={noneOptionRef}>Non débutée</option>
                                <option value="En cours" ref={pendingOptionRef}>En cours</option>
                                <option value="En attente" ref={waitingOptionRef}>En attente</option>
                                <option value="Terminée" ref={completedOptionRef}>Terminée</option>
                            </select>
                        </div>}
                    <button type="submit" className="btn btn-outline-light mt-3  d-block mx-auto">Valider</button>
                </form>}
        </>
    );
}

export default ProjectForm;