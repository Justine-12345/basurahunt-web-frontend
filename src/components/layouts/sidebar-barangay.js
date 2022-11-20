import React, {Fragment, useState} from 'react';
import {Link, useLocation } from 'react-router-dom';

const SidebarBarangay = () => {

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
					<div className="bh-sidebar-menus">
						<Link to="/barangay/dashboard" className="nav-link" style={{borderLeft:path==="/barangay/dashboard"?"5px solid white":"", fontWeight:path==="/barangay/dashboard"?"700":""}} className="nav-link"><span className="bi bi-speedometer"/><span className="dashboard-item"> Dashboard</span></Link>
						<Link to="/barangay/reports" className="nav-link" style={{borderLeft:path==="/barangay/reports"?"5px solid white":"", fontWeight:path==="/barangay/reports"?"700":""}} className="nav-link"><span className="bi bi-trash"/><span className="dashboard-item"> Illegal Dumps</span></Link>
						<Link to="/barangay/ranking" className="nav-link" style={{borderLeft:path==="/barangay/ranking"?"5px solid white":"", fontWeight:path==="/barangay/ranking"?"700":""}} className="nav-link"><span className="bi bi-bar-chart-fill"/><span className="dashboard-item"> Ranking</span></Link>
						<span className="bh-menuBtn nav-link" onClick={()=>dropdown("sched")}><span className="bi bi-calendar3"/><span className="dashboard-item"> Schedule</span><span id="sb-schedBtn" className="float-end text bi bi-caret-down-fill"/></span>
						<div id="sb-sched" className="sb-items">
							<Link to="/barangay/schedule/today" className="nav-link" style={{borderLeft:path==="/barangay/schedule/today"?"5px solid white":"", fontWeight:path==="/barangay/schedule/today"?"700":"" }}>Collection Today</Link>
							<Link to="/barangay/schedule" className="nav-link" style={{borderLeft:path==="/barangay/schedule"?"5px solid white":"", fontWeight:path==="/barangay/schedule"?"700":"" }}>Upcoming Collection</Link>
						</div>
						<Link to="/barangay/feedback/" style={{borderLeft:path==="/barangay/feedback/"?"5px solid white":"", fontWeight:path==="/barangay/feedback/"?"700":""}} className="nav-link"><i class="bi bi-chat-quote"></i><span className="dashboard-item"> Feedback</span></Link>
			
					</div>
				</nav>
			</div>
		</Fragment>
		)
}

export default SidebarBarangay