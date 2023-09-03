import { useState } from "react";
import ReactSwitch from "react-switch"
import style from "./Sequencer.module.css"
import Sequencer from ".";

export default function Toggle({handleToggle, step}) {
    const [active, setActive] = useState(false)

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
            />
        </>
    )
}