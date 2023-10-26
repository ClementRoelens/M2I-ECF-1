import { useNavigate } from "react-router-dom";
import { Project } from "../models/Project";

function ProjectThumb(props: ProjectThumbInterface) {

    const navigate = useNavigate();

    function isDateToday(date: Date): boolean {
        const day = date.getDate();
        const todayDay = new Date().getDate();
        if (day !== todayDay) {
            return false;
        }
        const month = date.getMonth();
        const todayMonth = new Date().getMonth();
        if (month !== todayMonth) {
            return false;
        }
        const dateYear = date.getFullYear();
        const todayYear = new Date().getFullYear();
        if (dateYear !== todayYear) {
            return false;
        }
        return true;
    }

    function isDatePassed(date: Date): boolean {
        const dateYear = date.getFullYear();
        const todayYear = new Date().getFullYear();
        if (todayYear > dateYear) {
            return true;
        }
        if (todayYear < dateYear) {
            return false;
        }
        const month = date.getMonth();
        const todayMonth = new Date().getMonth();
        if (todayMonth > month) {
            return true;
        }
        if (todayMonth < month) {
            return false;
        }
        const day = date.getDate();
        const todayDay = new Date().getDate();
        if (todayDay > day) {
            return true;
        }
        return false;
    }

    function getBackgroundColor(): string {
        let bgColor = "";
        switch (true) {
            case (props.project.status === "Terminée"):
                bgColor = "success";
                break;
            case (isDateToday(new Date(props.project.endDate))):
                bgColor = "warning";
                break;
            case (isDatePassed(new Date(props.project.endDate))):
                bgColor = "danger";
                break;
            default:
                bgColor = "dark";
        }

        return bgColor;
    }

    return (
        <li className="list-group-item border rounded my-2"
            onClick={() => navigate(`/${props.project.id}`)}>
            <button className={`btn btn-${getBackgroundColor()} text-light fw-bold d-block w-100 d-flex justify-content-between p-3`}>
                <p className="mb-0">{props.project.title}</p>
                <p className="mb-0">{new Date(props.project.endDate).toLocaleDateString()}</p>
            </button>
        </li>
    );
}

interface ProjectThumbInterface {
    project: Project;
}

export default ProjectThumb;