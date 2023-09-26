import { useEffect, useState } from "react";
import ReactSwitch from "react-switch"
import "./Sequencer.css"

export default function Toggle({handleToggle, step, on, curr}) {
    const [active, setActive] = useState(on)

    useEffect(() => {
        if (!on) {
            setActive(false)
        } else {
            setActive(true)
        }

        return setActive(on)
    }, [on])
    
    function returnState(e) {
        e.preventDefault()
        if (!active) {
            handleToggle(step, "C3")
        } else {
            handleToggle(step, null)
        }
        setActive(!active)
    }

    const onIcon = <div className="on-icon"><span className="material-symbols-outlined">radio_button_unchecked</span></div>
    const offIcon = <div className="off-icon"><span className="material-symbols-outlined">close</span></div>


    return (
        <>
            <label className={`switch ${curr}`}>
                <input type="checkbox"
                onChange={(e) => returnState(e)}
                checked={active}/>
                <span className={`slider`}>
                    {active && onIcon}
                    {!active && offIcon}
                </span>
            </label>
        </>
    )
}