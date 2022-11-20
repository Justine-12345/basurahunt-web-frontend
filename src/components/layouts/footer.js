import React, {Fragment} from 'react'
import {Link} from 'react-router-dom';

const Footer = () => {
	return(
		<Fragment>
			<footer className="bh-footer mt-auto" style={{paddingTop:"20px"}}>
			{localStorage.getItem("user")&&JSON.parse(localStorage.getItem("user")).role === "user"?
				<Fragment>
				<Link className="bh-footer-links" to="/newsfeed">Home</Link>
				<Link className="bh-footer-links" to="/about">About</Link>
				<Link className="bh-footer-links" to="/reports">Reports</Link>
				<Link className="bh-footer-links" to="/donation/new">Donate</Link>
				<Link className="bh-footer-links" to="/feedback">Feedback</Link>
				</Fragment>
				:<Link className="bh-footer-links" to="/about">About</Link>
			}

			{localStorage.getItem("user")&&JSON.parse(localStorage.getItem("user")).role === "administrator"?
				<Fragment>
				<Link className="bh-footer-links" to="/admin/dashboard">Dashboard</Link>
				<Link className="bh-footer-links" to="/admin/users">Users</Link>
				<Link className="bh-footer-links" to="/admin/reports">Reports</Link>
				<Link className="bh-footer-links" to="/admin/schedules">Schedules</Link>
				<Link className="bh-footer-links" to="/admin/donations">Donations</Link>
				<Link className="bh-footer-links" to="/admin/newsfeeds/new">Newsfeed</Link>
				<Link className="bh-footer-links" to="/admin/feedback">Feedbacks</Link>
				</Fragment>
				:""
			}

			{localStorage.getItem("user")&&JSON.parse(localStorage.getItem("user")).role === "barangayAdministrator"?
				<Fragment>
				<Link className="bh-footer-links" to="/barangay/dashboard">Dashboard</Link>
				<Link className="bh-footer-links" to="/barangay/reports">Reports</Link>
				<Link className="bh-footer-links" to="/barangay/ranking">Ranking</Link>
				<Link className="bh-footer-links" to="/barangay/schedule/today">Today</Link>
				<Link className="bh-footer-links" to="/barangay/schedule">Upcoming</Link>
				<Link className="bh-footer-links" to="/barangay/feedback">Feedbacks</Link>
				</Fragment>
				:""
			}

			{localStorage.getItem("user")&&JSON.parse(localStorage.getItem("user")).role === "garbageCollector"?
				<Fragment>
				<Link className="bh-footer-links" to="/collector/schedule/today">Today</Link>
				<Link className="bh-footer-links" to="/collector/schedule">Upcoming</Link>
				<Link className="bh-footer-links" to="/collector/assignments">Assignemnts</Link>
				<Link className="bh-footer-links" to="/collector/assignments/finished">Finished</Link>
				<Link className="bh-footer-links" to="/collector/feedback">Feedbacks</Link>
				</Fragment>
				:""
			}

				<hr/>
				<p>BasuraHunt</p>
			</footer>
		</Fragment>


		)
}

export default Footer