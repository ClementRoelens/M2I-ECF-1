import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../config/hooks";
import { deleteProject, getOneProject, getRandomProject } from "./projectSlice";
import { Alert, Popconfirm, Spin } from "antd";

function ProjectDetail() {
    const { id } = useParams();
    const [isDeleted, setIsDeleted] = useState(false);
    const [isNotFound, setIsNotFound] = useState(false);
    const project = useAppSelector(state => state.projects.selectedProject);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode");

    useEffect(() => {
        getSelectedProject();
    }, [id,mode])

    async function getSelectedProject() {
        if (mode){
            await dispatch(getRandomProject());
        } else if (id){
            const result: any = await dispatch(getOneProject(id!));
            if (result.error) {
                setIsNotFound(true);
                setTimeout(() => {
                    navigate("/");
                },2500);
            }
        } else {
            navigate("/");
        }
    }

    async function triggerDelete() {
        await dispatch(deleteProject(project!.id!));
        setIsDeleted(true);
        setTimeout(() => {
            navigate("/");
        }, 2500)
    }

    return (<>
        {project ?
            <>
                {isDeleted && <Alert type="success" message="Effectué" description="Projet correctement supprimé" />}
                <h1 className="text-center mb-4">{project.title}</h1>
                <p className="text-center">{project.description}</p>
                <div className="d-flex justify-content-around my-4 w-75 mx-auto">
                    <div>Débuté le {new Date(project.startDate).toLocaleDateString()}</div>
                    <div>Deadline : {new Date(project.endDate).toLocaleDateString()}</div>
                </div>
                <p className="text-center fs-5">Statut : <strong>{project.status}</strong></p>
                <div className="d-flex justify-content-around w-50 mx-auto mt-4 mb-2">
                    <Link className="btn btn-warning" to={`/edit/${project.id}`}><i className="bi bi-pencil-square"></i> Modifier</Link>
                    <Popconfirm
                        title="Supprimer projet" description="Êtes-vous sûrs de vouloir supprimer ce projet ?"
                        onConfirm={triggerDelete}
                        okText="Oui" cancelText="Non">
                        <button className="btn btn-danger"><i className="bi bi-trash"></i> Supprimer</button>
                    </Popconfirm>
                </div>
            </> :
            isNotFound ?
                <Alert type="error" message="Erreur" description="Aucun projet trouvé pour cet id" />
                :
                <div className="w-50 my-5 text-center mx-auto">
                    <Spin size="large" />
                    <p className="mt-5">Chargment en cours</p>
                </div>
        }
    </>
    );
}

export default ProjectDetail;