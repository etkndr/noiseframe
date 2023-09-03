import { Instrument } from "reactronica"

export default function Inst({sample}) {

    return (
        <Instrument type="sampler"
        samples={{"C3": sample}} />
    )
}