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
		NEW_PASSWORD_REQUEST,
		NEW_PASSWORD_SUCCESS,
		NEW_PASSWORD_FAIL,
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



// Login
export const login = (email, password) => async (dispatch) => {
    try {

        dispatch({ type: LOGIN_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/v1/login', { email, password }, config)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: data
        })

    } catch (error) {
        console.log(error)
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message
        })
    }
}


// Register user
export const register = (userData) => async (dispatch) => {
    try {

        dispatch({ type: REGISTER_USER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }


        const { data } = await axios.post('/api/v1/register', userData, config)

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.message
        })
    }
}




export const findEmail = (email) => async (dispatch) => {
	 try {

        dispatch({ type: FIND_EMAIL_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.post('/api/v1/findEmail', {email}, config)

      

        dispatch({
            type: FIND_EMAIL_SUCCESS,
            payload: data.count
        })

    } catch (error) {
        dispatch({
            type: FIND_EMAIL_FAIL,
            payload: error.response.data.message
        })
    }
}



export const refreshOtp = () => async (dispatch) => {
	 try {

        dispatch({ type: REFRESH_OTP_REQUEST })


        const { data } = await axios.put('/api/v1/otp/update')

        dispatch({
            type: REFRESH_OTP_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: REFRESH_OTP_FAIL,
            payload: error.response.data.message
        })
    }
}


export const checkOtp = (otp) => async (dispatch) => {
	 try {

        dispatch({ type: CHECK_OTP_REQUEST })

		const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put('/api/v1/otp/check/', otp, config)

        console.log(data)

        dispatch({
            type: CHECK_OTP_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CHECK_OTP_FAIL,
            payload: error.response.data.message
        })
    }
}
// load auth/user
export const loadUser = () => async (dispatch) => {
    try {

        dispatch({ type: LOAD_USER_REQUEST })

        const { data } = await axios.get('/api/v1/me')

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data
        })

    } catch (error) {
        localStorage.clear()

        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update profile
export const updateProfile = (userData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PROFILE_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put('/api/v1/me/update', userData, config)

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message
        })
    }
}


// Update password
export const updatePassword = (passwords) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put('/api/v1/password/update', passwords, config)

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}


// Forgot password
export const forgotPassword = (email) => async (dispatch) => {
    try {

        dispatch({ type: FORGOT_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/v1/password/forgot', email, config)

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}


// Reset password
export const resetPassword = (token, passwords) => async (dispatch) => {
    try {

        dispatch({ type: NEW_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/password/reset/${token}`, passwords, config)

        dispatch({
            type: NEW_PASSWORD_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}

// Logout user
export const logout = () => async (dispatch) => {
    try {

        await axios.get('/api/v1/logout')

        dispatch({
            type: LOGOUT_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response.data.message
        })
    }
}


export const reportedDumps = () => async (dispatch) => {
    try {
        dispatch({ type: USER_DUMPS_REQUEST })

        const { data } = await axios.get('/api/v1/me/reported-dumps')
      
        dispatch({
            type: USER_DUMPS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_DUMPS_FAIL,
            payload: error.response.data.message
        })
    }
}


export const receiveItems = () => async (dispatch) => {
    try {
        dispatch({ type: USER_RECEIVE_REQUEST })

        const { data } = await axios.get('/api/v1/me/receive-items')
        
        dispatch({
            type: USER_RECEIVE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_RECEIVE_FAIL,
            payload: error.response.data.message
        })
    }
}

export const donatedItems = () => async (dispatch) => {
    try {
        dispatch({ type: USER_DONATED_REQUEST })

        const { data } = await axios.get('/api/v1/me/donated-items')

        dispatch({
            type: USER_DONATED_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_DONATED_FAIL,
            payload: error.response.data.message
        })
    }
}

export const claimedItems = () => async (dispatch) => {
    try {
        dispatch({ type: USER_CLAIMED_REQUEST })

        const { data } = await axios.get('/api/v1/me/claimed-items')

        dispatch({
            type: USER_CLAIMED_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_CLAIMED_FAIL,
            payload: error.response.data.message
        })
    }
}



// Get all users - ADMIN
export const allUsers = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_USERS_REQUEST })

        const { data } = await axios.get('/api/v1/admin/users')

        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users
        })

    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error.response.data.message
        })
    }
}


// Update user - ADMIN
export const updateUser = (id, userData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_USER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/admin/user/${id}`, userData, config)

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

// Get user details - ADMIN
export const getUserDetails = (id) => async (dispatch) => {
    try {

        dispatch({ type: USER_DETAILS_REQUEST })


        const { data } = await axios.get(`/api/v1/admin/user/${id}`)

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Delete user - ADMIN
export const deleteUser = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_USER_REQUEST })

        const { data } = await axios.delete(`/api/v1/admin/user/${id}`)

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.message
        })
    }
}




export const readNofication = (notifCode) => async (dispatch) => {
     try {


        dispatch({ type: READ_NOTIFICATION_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put('/api/v1/me/read-notification', notifCode, config)


        dispatch({
            type: READ_NOTIFICATION_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: READ_NOTIFICATION_FAIL,
            payload: error.response.data.message
        })
    }
}


// Get user Level and exp
export const getLevelExp = () => async (dispatch) => {
    try {

        dispatch({ type: GET_LEVEL_EXP_REQUEST })


        const { data } = await axios.get(`/api/v1/me/level-exp`)

        dispatch({
            type: GET_LEVEL_EXP_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: GET_LEVEL_EXP_FAIL,
            payload: error.response.data.message
        })
    }
}


// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}