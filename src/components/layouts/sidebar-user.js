import React, {Fragment, useState} from 'react';
import {Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

const SidebarUser = () => {

	let location = useLocation();
	let path = location.pathname

	const menuSideBar = (e) => {
		document.getElementById("bh-sidebar").style.display = "block";
		document.getElementById("bh-sidebarBtn").style.display = "none";
	}
	const menuSideBarClose = (e) => {
		document.getElementById("bh-sidebar").style.display = "none";
		document.getElementById("bh-sidebarBtn").style.display = "block";
	}

	const dropdown = (menu) => {
		if(document.getElementById("sb-"+menu).style.display === "block"){
			document.getElementById("sb-"+menu).style.display = "none";
			document.getElementById("sb-"+menu+"Btn").classList.remove("bi-caret-up-fill");
			document.getElementById("sb-"+menu+"Btn").classList.add("bi-caret-down-fill");
		}
		else{
			document.getElementById("sb-"+menu).style.display = "block";
			document.getElementById("sb-"+menu+"Btn").classList.remove("bi-caret-down-fill");
			document.getElementById("sb-"+menu+"Btn").classList.add("bi-caret-up-fill");
		}
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
			<button className="btn bh-sidebarBtn" id="bh-sidebarBtn" onClick={()=>menuSideBar()}>Menu</button>
			
			<div className="user-select-none bh-sidebar" id="bh-sidebar" style={{zIndex:"100"}}>
				<p className="text-center fw-bold bh-sidebar-header">Menu<span className="bh-sidebar-close float-end bi bi-x-lg" onClick={()=>menuSideBarClose()}></span></p><hr/>
				<nav className="nav flex-column">
					<Link to="/report/new" className="nav-link" style={{borderLeft:path==="/report/new"?"5px solid white":"", fontWeight:path==="/report/new"?"700":"" }}><FontAwesomeIcon className="bi" icon="fa fa-crosshairs"/><span className="dashboard-item"> Report Illegal Dumps</span></Link><hr/>
					<div className="bh-sidebar-menus">
						<span className="bh-menuBtn nav-link" onClick={()=>dropdown("home")}><span className="bi bi-house"/><span className="dashboard-item"> Home</span><span id="sb-homeBtn" className="float-end text bi bi-caret-down-fill"/></span>
						<div id="sb-home" className="sb-items">
							<Link to="/newsfeed" className="nav-link" style={{borderLeft:path==="/newsfeed"?"5px solid white":"", fontWeight:path==="/newsfeed"?"700":"" }}>Newsfeed</Link>
							<Link to="/ranking" className="nav-link" style={{borderLeft:path==="/ranking"?"5px solid white":"", fontWeight:path==="/ranking"?"700":"" }}>Ranking</Link>
							<Link to="/reports" className="nav-link" style={{borderLeft:path==="/reports"?"5px solid white":"", fontWeight:path==="/reports"?"700":"" }}>Illegal Dump Reports</Link>
						</div>

						<span className="bh-menuBtn nav-link" onClick={()=>dropdown("sched")}><span className="bi bi-calendar3"/><span className="dashboard-item"> Schedule</span><span id="sb-schedBtn" className="float-end text bi bi-caret-down-fill"/></span>
						<div id="sb-sched" className="sb-items">
							<Link to="/schedule/today" className="nav-link" style={{borderLeft:path==="/schedule/today"?"5px solid white":"", fontWeight:path==="/schedule/today"?"700":"" }}>Collection Today</Link>
							<Link to="/schedule" className="nav-link" style={{borderLeft:path==="/schedule"?"5px solid white":"", fontWeight:path==="/schedule"?"700":"" }}>Upcoming Collection</Link>
						</div>

						<span className="bh-menuBtn nav-link" onClick={()=>dropdown("donation")}><span className="bi bi-box2"/><span className="dashboard-item"> Donation</span><span id="sb-donationBtn" className="float-end text bi bi-caret-down-fill"/></span>
						<div id="sb-donation" className="sb-items">
							<Link to="/donations" className="nav-link" style={{borderLeft:path==="/donations"?"5px solid white":"", fontWeight:path==="/admin/users"?"700":"" }}>Find Items</Link>
							<Link to="/donation/new" className="nav-link" style={{borderLeft:path==="/donation/new"?"5px solid white":"", fontWeight:path==="/donation/new"?"700":"" }}>Donate Items</Link>
						</div>
						<Link to="/feedback/" style={{borderLeft:path==="/feedback/"?"5px solid white":"", fontWeight:path==="/feedback/"?"700":""}} className="nav-link"><i class="bi bi-chat-quote"></i><span className="dashboard-item"> Feedback</span></Link>
			
					</div>
				</nav>
			</div>
		</Fragment>
		)
}

export default SidebarUser