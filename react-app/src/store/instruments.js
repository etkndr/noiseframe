const GET_INSTRUMENTS = "instruments/GET_INSTRUMENTS"
const GET_INSTRUMENT = "instruments/GET_INSTRUMENT"
const SAVE_INSTRUMENT = "instruments/SAVE_INSTRUMENT"

function loadInstruments(insts) {
    return {
        type: GET_INSTRUMENTS,
        insts
    }
}

function loadInstrument(inst) {
    return {
        type: GET_INSTRUMENT,
        inst
    }
}

function newInstrument(inst) {
    return {
        type: SAVE_INSTRUMENT,
        inst
    }
}

export const getInstruments = () => async dispatch => {
    const res = await fetch("/api/instruments/", {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(loadInstruments(data))
        return data
    }
}

export const getInstrument = (id) => async dispatch => {
    const res = await fetch(`/api/instruments/${id}`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(loadInstrument(data))
        return data
    }
}

export const saveInstrument = (inst) => async dispatch => {
    const res = await fetch("/api/instruments/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(inst)
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(newInstrument(data))
        return data
    }
}

const initState = {}

export default function instruments(state = initState, action) {
    let newState = {...state}
    switch (action.type) {
        case GET_INSTRUMENTS:
            action.insts.instruments.forEach((inst) => {
                newState[inst.id] = inst
            })
            return newState
        case GET_INSTRUMENT:
            newState[action.inst.id] = action.inst
            return newState
        default:
            return state
    }
}