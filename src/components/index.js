import React, { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom';
import MetaData from '../components/layouts/MetaData'
import axios from 'axios';
const Index = () => {
    const { loading, isAuthenticated, user, error } = useSelector(state => state.auth)
    let navigate = useNavigate()

    useEffect(() => {

        if (isAuthenticated || localStorage.getItem("isAuthenticated")) {
            if (user && user.otp_status === "Verefied" || JSON.parse(localStorage.getItem("user")).otp_status === "Verefied") {
                if (user && user.role === "administrator" || JSON.parse(localStorage.getItem("user")).role === "administrator") {
                    navigate('/admin/dashboard')
                }
                else if (user && user.role === "garbageCollector" || JSON.parse(localStorage.getItem("user")).role === "garbageCollector") {
                    navigate('/collector/profile')
                }
                else if (user && user.role === "barangayAdministrator" || JSON.parse(localStorage.getItem("user")).role === "barangayAdministrator") {
                    navigate('/barangay/dashboard')
                }
                else if (user && user.role === "user" || JSON.parse(localStorage.getItem("user")).role === "user") {
                    navigate('/newsfeed')
                }
                else if (user && user.role === "newUser" || JSON.parse(localStorage.getItem("user")).role === "newUser") {
                    navigate('/newsfeed')
                }
                else if (user && user.role === "banned" || JSON.parse(localStorage.getItem("user")).role === "banned") {
                    navigate('/user-banned')
                }

            } else {
                navigate('/register/email-verification')
            }
        }


        // if(isAuthenticated || localStorage.getItem("isAuthenticated")){
        // 	// dispatch(loadUser())
        // 		 //       navigate('/register/email-verification')
        //    }

    }, [error, isAuthenticated])

    const go = () => {

        axios.post(`https://app.nativenotify.com/api/notification`, {
            appId: 4788,
            appToken: "EAvJ1tXd10jlCaJzV71ZkE",
            title: "Push title here as a string",
            body: "Push message here as a string",
            dateSent: "11-12-2022 8:14PM",
            pushData: { yourProperty: "yourPropertyValue" }
        }).then(result => { console.log(result) })
        .catch(error => { console.error(error) });

    }

    return (
        <Fragment>
            <MetaData title={"Welcome!"} />
            <div className="bh-landingPage">
                <div className="row">
                    <div className="col-md order-2 order-md-1 my-sm-5">
                        <p>BasuraHunt - Illegal Dumps Monitoring and Solid Waste Collection Scheduling System, with Donation of Reusable Items, for Taguig City</p>
                        <div className="mt-5">
                            <Link className="bh-lp-login" to="/login">Login</Link>
                            <Link to="about" className="bh-lp-explore">Learn More {">"} </Link>
                        </div>
                    </div>
                    <span onClick={go} className='btn btn-primary'>Send</span>
                    <div className="col-md bh-lp order-1 order-md-2">
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Index