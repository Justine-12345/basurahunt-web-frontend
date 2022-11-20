import axios from 'axios'
import {
		LOGIN_REQUEST,
		LOGIN_SUCCESS,
		LOGIN_FAIL,
		FIND_EMAIL_REQUEST,
		FIND_EMAIL_SUCCESS,
		FIND_EMAIL_FAIL,
		REGISTER_USER_REQUEST,
		REGISTER_USER_SUCCESS,
		REGISTER_USER_FAIL,
		REFRESH_OTP_REQUEST,
		REFRESH_OTP_SUCCESS,
		REFRESH_OTP_FAIL,
		CHECK_OTP_REQUEST,
		CHECK_OTP_SUCCESS,
		CHECK_OTP_FAIL,
		LOGOUT_SUCCESS,
		LOGOUT_FAIL,
		LOAD_USER_REQUEST,
		LOAD_USER_SUCCESS,
		LOAD_USER_FAIL,
		UPDATE_PROFILE_REQUEST,
		UPDATE_PROFILE_SUCCESS,
		UPDATE_PROFILE_RESET,
		UPDATE_PROFILE_FAIL,
		UPDATE_PASSWORD_REQUEST,
		UPDATE_PASSWORD_SUCCESS,
		UPDATE_PASSWORD_RESET,
		UPDATE_PASSWORD_FAIL,
		FORGOT_PASSWORD_REQUEST,
		FORGOT_PASSWORD_SUCCESS,
		FORGOT_PASSWORD_FAIL,
		FORGOT_PASSWORD_RESET,
		NEW_PASSWORD_REQUEST,
		NEW_PASSWORD_SUCCESS,
		NEW_PASSWORD_FAIL,
		NEW_PASSWORD_RESET,
		ALL_USERS_REQUEST,
		ALL_USERS_SUCCESS,
		ALL_USERS_FAIL,
		USER_DETAILS_REQUEST,
		USER_DETAILS_SUCCESS,
		USER_DETAILS_FAIL,
		USER_DETAILS_RESET,
		UPDATE_USER_REQUEST,
		UPDATE_USER_SUCCESS,
		UPDATE_USER_RESET,
		UPDATE_USER_FAIL,
		DELETE_USER_REQUEST,
		DELETE_USER_SUCCESS,
		DELETE_USER_RESET,
		DELETE_USER_FAIL,
		USER_DUMPS_REQUEST,
		USER_DUMPS_SUCCESS,
		USER_DUMPS_FAIL,
		USER_RECEIVE_REQUEST,
		USER_RECEIVE_SUCCESS,
		USER_RECEIVE_FAIL,
		USER_DONATED_REQUEST,
		USER_DONATED_SUCCESS,
		USER_DONATED_FAIL,
		USER_CLAIMED_REQUEST,
		USER_CLAIMED_SUCCESS,
		USER_CLAIMED_FAIL,
		READ_NOTIFICATION_REQUEST,
		READ_NOTIFICATION_SUCCESS,
		READ_NOTIFICATION_RESET,
		READ_NOTIFICATION_FAIL,
		GET_LEVEL_EXP_REQUEST,
		GET_LEVEL_EXP_SUCCESS,
		GET_LEVEL_EXP_RESET,
		GET_LEVEL_EXP_FAIL,
		CLEAR_ERRORS
	}  from '../constants/userConstants'



export const authReducer = (state = { user:{} }, action) => {
	switch(action.type){
		case LOGIN_REQUEST:
		case REGISTER_USER_REQUEST:
		case LOAD_USER_REQUEST:
		case CHECK_OTP_REQUEST:
			return{
				loading: true,
				isAuthenticated: false,
			}

		case LOGIN_SUCCESS:
		case REGISTER_USER_SUCCESS:
		case LOAD_USER_SUCCESS:
		case CHECK_OTP_SUCCESS:
			localStorage.setItem("isAuthenticated", true);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            if(action.payload.token){
                localStorage.setItem("token",action.payload.token)
            }
			return{
				...state,
				loading: false,
				isAuthenticated: true,
				user:action.payload.user,
				userBrgyRank: action.payload.userBrgyRank,
				userCityRank: action.payload.userCityRank,
				otp_status: action.payload.otp_status
			}

		case LOGOUT_SUCCESS:
            localStorage.clear();
            return {
            	...state,
                loading: false,
                isAuthenticated: false,
                user: null
            }

        case LOAD_USER_FAIL:
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload
            }

        case LOGOUT_FAIL:
            return {
                ...state,
                error: action.payload
            }

		case LOGIN_FAIL:
		case REGISTER_USER_FAIL:
		case CHECK_OTP_FAIL:
			return{
				...state,
				loading:false,
				isAuthenticated:false,
				user: null,
				error: action.payload
			}
		case CLEAR_ERRORS:
			return{
				...state,
				error:null
			}
		default:
			return state

	}
}


export const findEmailReducer = (state = {}, action) => {
		switch(action.type){

			case FIND_EMAIL_REQUEST:
				return{
					...state,
					loading: true,
				}
			case FIND_EMAIL_SUCCESS:
				return{
					...state,
					loading:false,
					count:action.payload
				}
			case FIND_EMAIL_FAIL:
			 	return {
               	 	...state,
                	loading: false,
                	error: action.payload
            	}
			case CLEAR_ERRORS:
				return{
					...state,
					error:null
				}
			default:
				return state;
		}
}



export const userReducer = (state = {}, action) => {
    switch (action.type) {

        case UPDATE_PROFILE_REQUEST:
        case UPDATE_PASSWORD_REQUEST:
        case UPDATE_USER_REQUEST:
        case DELETE_USER_REQUEST:
        case REFRESH_OTP_REQUEST:
            return {
                ...state,
                loading: true
            }

        case UPDATE_PROFILE_SUCCESS:
        case UPDATE_PASSWORD_SUCCESS:
        case UPDATE_USER_SUCCESS:
        case REFRESH_OTP_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload.success,
                user:action.payload.user
            }

        case DELETE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case UPDATE_PROFILE_RESET:
        case UPDATE_PASSWORD_RESET:
        case UPDATE_USER_RESET:
            return {
                ...state,
                isUpdated: false
            }

        case DELETE_USER_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case UPDATE_PROFILE_FAIL:
        case UPDATE_PASSWORD_FAIL:
        case UPDATE_USER_FAIL:
        case DELETE_USER_FAIL:
        case REFRESH_OTP_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}


export const forgotPasswordReducer = (state = {}, action) => {
    switch (action.type) {

        case FORGOT_PASSWORD_REQUEST:
        case NEW_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }

        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload
            }

        case NEW_PASSWORD_SUCCESS:
       		localStorage.setItem("isAuthenticated", true);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            return {
                ...state,
                success: action.payload.success,
            }
            
        case FORGOT_PASSWORD_RESET:
        case NEW_PASSWORD_RESET:
            return {
                ...state,
                success: false,

            }

        case FORGOT_PASSWORD_FAIL:
        case NEW_PASSWORD_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}



export const allUsersReducer = (state = {users: []}, action) => {
		switch(action.type){

			case ALL_USERS_REQUEST:
				return{
					...state,
					loading: true,
				}
			case ALL_USERS_SUCCESS:
				return{
					...state,
					loading:false,
					users:action.payload
				}
			case CLEAR_ERRORS:
				return{
					...state,
					error:null
				}
			default:
				return state;
		}
}




export const userDetailsReducer = (state = { user: {} }, action) => {
    switch (action.type) {

        case USER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case USER_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload.user,
                userBrgyRank:action.payload.userBrgyRank,
				userCityRank:action.payload.userCityRank,
            }

        case USER_DETAILS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case USER_DETAILS_RESET:
            return {
                ...state,
                 user: undefined
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}




export const userReportsAndItemsReducer = (state={}, action) => {
	switch(action.type){
		case USER_DUMPS_REQUEST:
		case USER_RECEIVE_REQUEST:
		case USER_DONATED_REQUEST:
		case USER_CLAIMED_REQUEST:
			return{
				 ...state,
                loading: true,
                error: null
			}

		case USER_CLAIMED_SUCCESS:
			return{
				 ...state,
                loading: false,
                userClaimedItems:action.payload.userClaimedItems
			}

		case USER_RECEIVE_SUCCESS:
		console.log("greate")
			return{
				 ...state,
                loading: false,
                userReceiveItems:action.payload.userReceiveItems.received_items
			}

		case USER_DUMPS_SUCCESS:
			return{
				 ...state,
                loading: false,
                userDumps:action.payload.userDumps.reported_dumps
			}

		case USER_DONATED_SUCCESS:
			return{
				 ...state,
                loading: false,
                userDonatedItems:action.payload.userDonatedItems.donated_items
			}

		case USER_DUMPS_FAIL:
        case USER_RECEIVE_FAIL:
        case USER_DONATED_FAIL:
        case USER_CLAIMED_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
	}
}


export const notificationReducer = (state={}, action) => {
	switch(action.type){
		case READ_NOTIFICATION_REQUEST:
			return{
				 ...state,
                loading: true,
                error: null
			}

		case READ_NOTIFICATION_SUCCESS:
			return{
				 ...state,
                loading: false,
                isRead:action.payload.success,
                user:action.payload.user
			}

		case READ_NOTIFICATION_RESET:
            return {
                ...state,
                isRead: false
            }

		case READ_NOTIFICATION_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
	}
}


export const levelExpReducer = (state = { levelExp: {} }, action) => {
    switch (action.type) {

        case GET_LEVEL_EXP_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case GET_LEVEL_EXP_SUCCESS:
            return {
                ...state,
                loading: false,
                levelExp: action.payload.levelExp
            }

        case GET_LEVEL_EXP_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case GET_LEVEL_EXP_RESET:
            return {
                ...state,
                 levelExp: undefined
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}


