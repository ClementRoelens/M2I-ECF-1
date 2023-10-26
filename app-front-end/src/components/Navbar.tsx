import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../config/hooks";
import { getRandomProject } from "./projectSlice";
import teapot from "../assets/teapot.svg";

function Navbar() {
    const projects = useAppSelector(state => state.projects.projects);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

async function clicked(){
    await dispatch(getRandomProject());
    navigate("/random?mode=random");
}

    return (
        <header>
            <nav className="navbar bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand text-light" to="/"><i className="bi bi-globe"></i> eProjects</Link>
                    <ul className="navbar nav">
                        <li className="nav-item"><Link className="nav-link text-light" to="/addProject">Ajouter un projet</Link></li>
                        {projects.length > 0 && <li className="nav-item"><button className="nav-link text-light" onClick={clicked}>Voir un projet au hasard</button></li>}
                        <li className="nav-item"><Link className="nav-link" to="/teapot"><img className="teapot" src={teapot} alt="teapot" /></Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;