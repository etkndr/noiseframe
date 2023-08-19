const GET_INSTRUMENTS = "instruments/GET_INSTRUMENTS"

function loadInstruments(insts) {
    return {
        type: GET_INSTRUMENTS,
        insts
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

const initState = {}

export default function instruments(state = initState, action) {
    let newState = {...state}
    switch (action.type) {
        case GET_INSTRUMENTS:
            action.insts.instruments.forEach((inst) => {
                newState[inst.id] = inst
            })
            return newState
        default:
            return state
    }
}