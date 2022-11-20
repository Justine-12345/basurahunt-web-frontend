import React, {Fragment, useState} from 'react';
import {Link, useLocation } from 'react-router-dom';


const Sidebar = () => {

	let location = useLocation();
	let path = location.pathname

	const dashboardSideBar = (e) => {
		document.getElementById("bh-sidebar").style.display = "block";
		document.getElementById("bh-sidebarBtn").style.display = "none";
	}
	const dashboardSideBarClose = (e) => {
		document.getElementById("bh-sidebar").style.display = "none";
		document.getElementById("bh-sidebarBtn").style.display = "block";
	}

	document.addEventListener('click', function handleClickOutsideTab(event){
		const sidebar = document.getElementById("bh-sidebar");
		const sidebarBtn = document.getElementById("bh-sidebarBtn");

		if((!sidebar.contains(event.target))&(!sidebarBtn.contains(event.target))){
			sidebar.style.display = "none";
			sidebarBtn.style.display = "block";
		}
	});
	

	return(
		<Fragment>
			<button className="btn bh-sidebarBtn" id="bh-sidebarBtn" onClick={()=>dashboardSideBar()}>Dashboard</button>
			<div className="bh-sidebar" id="bh-sidebar" style={{zIndex:"100"}}>
					<Link to="/admin/dashboard"><p className="text-center fw-bold bh-sidebar-header" style={{borderLeft:path==="/admin/dashboard"?"5px solid white":"",fontSize:"20px"}}><i className="bi bi-speedometer2"></i><span className="dashboard-item">&nbsp;Dashboard</span><span className="bh-sidebar-close float-end bi bi-x-lg" onClick={()=>dashboardSideBarClose()}></span></p></Link><hr/>
				<nav className="nav flex-column">
					<Link to="/admin/users" className="nav-link" style={{borderLeft:path==="/admin/users"?"5px solid white":"", fontWeight:path==="/admin/users"?"700":"" }}><span className="bi bi-people"/><span className="dashboard-item"> Users</span></Link>
					<Link to="/admin/reports" className="nav-link" style={{borderLeft:path==="/admin/reports"||path==="/admin/report/new"?"5px solid white":"", fontWeight:path==="/admin/reports"||path==="/admin/report/new"?"700":""}} className="nav-link"><span className="bi bi-trash"/><span className="dashboard-item"> Illegal Dumps</span></Link>
					<Link to="/admin/schedules" className="nav-link" style={{borderLeft:path==="/admin/schedules"?"5px solid white":"", fontWeight:path==="/admin/schedules"?"700":""}}><span className="bi bi-calendar3"/><span className="dashboard-item"> Collection Schedule</span></Link>
						<Link to="/admin/donations" className="nav-link" style={{borderLeft:path==="/admin/donations"?"5px solid white":"", fontWeight:path==="/admin/donations"?"700":""}}><span className="bi bi-box2"/><span className="dashboard-item"> Donated Items</span></Link>
					{/*<Link to="/admin/messages" className="nav-link" style={{borderLeft:path==="/admin/messages"?"5px solid white":"", fontWeight:path==="/admin/messages"?"700":""}}><span className="bi bi-envelope"/><span className="dashboard-item"> Messages</span></Link>*/}
					<Link to="/admin/newsfeeds/new" style={{borderLeft:path==="/admin/newsfeeds/new"?"5px solid white":"", fontWeight:path==="/admin/newsfeeds/new"?"700":""}} className="nav-link"><span className="bi bi-newspaper"/><span className="dashboard-item"> Newsfeeds</span></Link>
					<Link to="/admin/feedback/" style={{borderLeft:path==="/admin/feedback/"?"5px solid white":"", fontWeight:path==="/admin/feedback/"?"700":""}} className="nav-link"><i class="bi bi-chat-quote"></i><span className="dashboard-item"> Feedbacks</span></Link>
			
				</nav>
			</div>
		</Fragment>
		)
}

export default Sidebar