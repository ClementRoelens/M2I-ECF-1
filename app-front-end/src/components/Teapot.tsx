import axios from "axios";
import { useEffect, useState } from "react";

function Teapot() {
    const [teapot,setTeapot] = useState<TeapotInterface | null>(null);

    useEffect(() => {
        teatime();
    },[]);

    async function teatime(){
        try {
            const res = await axios.get("http://127.0.0.1:3000/teatime");
        }
        catch (err:any){
            setTeapot(err.response.data);
        }
    }

    return (<>
    {teapot && 
    <>
    <h1 className="text-center display-4 fw-bold">It's teatime !</h1>
    <p className="my-3 fs-5">{teapot.summary}</p>
    <p className="my-3 fs-5">{teapot.origins}</p>
    <p className="my-3 fs-5">{teapot.teaInEuropa}</p>
    <p className="my-3 fs-5">{teapot.indiaRole}</p>
    <p className="my-3 fs-5">{teapot.teaTime}</p>
    <p className="my-3 fs-5">{teapot.porcelain}</p>
    <p className="my-3 fs-5">{teapot.britannicCulture}</p>
    <p className="my-3 fs-5">{teapot.britannicHistory}</p>
    <p className="my-3 fs-5">{teapot.secondSummary}</p>
    </>
    }
    </>);
}

interface TeapotInterface {
    summary: string;
    origins: string;
    teaInEuropa: string;
    indiaRole: string;
    teaTime: string;
    porcelain: string;
    britannicCulture: string;
    britannicHistory: string;
    secondSummary: string;
    secondBreakfast: null;
};

export default Teapot;