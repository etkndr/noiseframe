import { useState } from "react";
import ReactSwitch from "react-switch"
import "./Sequencer.css"

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

    const onIcon = <div className="on-icon"><span class="material-symbols-outlined">radio_button_unchecked</span></div>
    const offIcon = <div className="off-icon"><span class="material-symbols-outlined">close</span></div>

    return (
        <>
            <label className="switch">
                <input type="checkbox"
                onChange={returnState}
                checked={active}/>
                <span className="slider">
                    {active && onIcon}
                    {!active && offIcon}
                </span>
            </label>
        </>
    )
}