const GET_INSTRUMENTS = "instruments/GET_INSTRUMENTS"
const GET_INSTRUMENT = "instruments/GET_INSTRUMENT"
const SAVE_INSTRUMENT = "instruments/SAVE_INSTRUMENT"
const EDIT_INSTRUMENT = "instruments/EDIT_INSTRUMENT"
const DELETE_INSTRUMENT = "instruments/DELETE_INSTRUMENTS"
const NEW_SAMPLE = "instruments/NEW_SAMPLE"
const DELETE_SAMPLE = "instrument/DELETE_SAMPLE"

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

function saveEdit(inst) {
    return {
        type: EDIT_INSTRUMENT,
        inst
    }
}

function dltInstrument(inst) {
    return {
        type: DELETE_INSTRUMENT,
        inst
    }
}

function addSample(sample) {
    return {
        type: NEW_SAMPLE,
        sample
    }
}

function dltSample(sample) {
    return {
        type: DELETE_SAMPLE,
        sample
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

export const editInstrument = (id, inst) => async dispatch => {
    const res = await fetch(`/api/instruments/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(inst)
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(saveEdit(data))
        return data
    }
}

export const deleteInstrument = (id) => async dispatch => {
    const res = await fetch(`/api/instruments/${id}`, {
        method: "DELETE"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(dltInstrument(data))
        return data
    }
}

export const newSample = (id, sample) => async dispatch => {
    console.log(sample)
    const res = await fetch(`/api/instruments/${id}/samples`, {
        method: "POST",
        body: sample
    })


    if (res.ok) {
        const data = await res.json()
        dispatch(addSample(data))
        return data
    }
}

export const deleteSample = (id) => async dispatch => {
    const res = await fetch(`/api/samples/${id}`, {
        method: "DELETE"
    })

    if (res.ok) {
        const data = await res.json()
        dispatch(dltSample(data))
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
        case EDIT_INSTRUMENT:
            newState[action.inst.id] = action.inst
            return newState
        case DELETE_INSTRUMENT:
            delete newState[action.inst.id]
            return newState
        case NEW_SAMPLE:
            newState[action.sample.id] = action.sample
            return newState
        case DELETE_SAMPLE:
            delete newState[action.sample.id]
            return newState
        default:
            return state
    }
}