import { useParams } from "react-router-dom"

export default function ClassDetailPage(){
    const {id} = useParams();
    return(
        <section>
            <div><p>Class Detail Page</p></div>
        </section>
    )
}