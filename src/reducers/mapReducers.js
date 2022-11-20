import {
    SET_COORDINATE,
    RESET_COORDINATE
}from "../constants/mapConstants";



export const coordinateReducer = (state = {}, action) => {
    switch (action.type) {

        case SET_COORDINATE:
            console.log("payload", action.payload)
            return {
                ...state,
                latitude: action.payload.latitude,
                longitude: action.payload.longitude
            }

        case RESET_COORDINATE:
            return {
                ...state,
                latitude: undefined,
                longtitude:undefined
            }

        default:
            return state
    }
}