import { useState } from "react";
import ReactSwitch from "react-switch"
import style from "./Sequencer.module.css"

export default function Toggle({handleToggle, step, on}) {
    const [active, setActive] = useState(on)

    function returnState() {
        setActive(!active)
        if (!active) {
           handleToggle(step, "C3")
        } else {
            handleToggle(step, null)
        }
    }

    return (
        <>
            <ReactSwitch
                onChange={returnState}
                checked={active}
                checkedIcon={false}
                uncheckedIcon={false}
                width={45}
                onHandleColor="#DFD7CD"
                offHandleColor="#DFD7CD"
                onColor="#4f7487"
            />
        </>
    )
}