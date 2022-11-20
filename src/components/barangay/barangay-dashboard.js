import React, { Fragment, useEffect, useState } from 'react'
// import {Link} from 'react-router-dom';
import SidebarBarangay from '../../components/layouts/sidebar-barangay';
import MetaData from '../../components/layouts/MetaData'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getTotalUsers, getTotalDumps, getCleanedDumps, getUncleanedDumps, clearErrors } from '../../actions/dashboardActions'
import { rankings } from '../../actions/dumpActions'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	ArcElement,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';


const BarangayDashboard = () => {
	const monthLabelsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const [cdStartDate, setCdStartDate] = useState('');
	const [cdEndDate, setCdEndDate] = useState('');
	const [udStartDate, setUdStartDate] = useState('');
	const [udEndDate, setUdEndDate] = useState('');

	const [rpbStartDate, setRpbStartDate] = useState('');
	const [rpbEndDate, setRpbEndDate] = useState('');

	const [barangay, setBarangay] = useState('');

	const [cluster, setCluster] = useState('$barangay');
	const [applyCluster, setApplyCluster] = useState("Barangay");

	const alert = useAlert();
	const dispatch = useDispatch();
	const { error: usersTotalError, usersTotal } = useSelector(state => state.usersTotal);
	const { error: dumpsTotalError, dumpsTotal } = useSelector(state => state.dumpsTotal);
	const { error: cleanedDumpsError, cleanedDumps } = useSelector(state => state.cleanedDumps);
	const { error: uncleanedDumpsError, uncleanedDumps } = useSelector(state => state.uncleanedDumps);
	const { error: rankingError, barangaysOrDistrictStatuses, mostReportedBrgyDone, loading:rankingLoading } = useSelector(state => state.ranking)
	const { user } = useSelector(state => state.auth)
	useEffect(() => {
		dispatch(getTotalUsers());
		dispatch(getTotalDumps());
		dispatch(rankings());

		const dateToday = new Date();

		const formDataCleanedDumps = new FormData();
		formDataCleanedDumps.set('cdStartDate', '2022-01-01');
		formDataCleanedDumps.set('cdEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getCleanedDumps(formDataCleanedDumps))

		const formDataUncleanedDumps = new FormData();
		formDataUncleanedDumps.set('udStartDate', '2022-01-01');
		formDataUncleanedDumps.set('udEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getUncleanedDumps(formDataUncleanedDumps))

		const formDataRanking = new FormData();
		formDataRanking.set('rpbStartDate', '2022-01-01');
		formDataRanking.set('rpbEndDate', (dateToday.getFullYear() + 1) + '-01-01');

		dispatch(rankings(formDataRanking))



		if (usersTotalError) {
			alert.error(usersTotalError);
			dispatch(clearErrors())
		}

		if (dumpsTotalError) {
			alert.error(dumpsTotalError);
			dispatch(clearErrors())
		}

		if (rankingError) {
			alert.error(rankingError);
			dispatch(clearErrors())
		}

	}, [dispatch, usersTotalError, dumpsTotalError, rankingError, alert]);

	const chartLabel = (datas, category) => {

		if (category === "barangaysOrDistrictStatuses") {
			let labels = [];
			datas.forEach((data) => {
				if (applyCluster === "District") {
					labels.push("District #" + data.clusterName);
				} else {
					labels.push([data.clusterName]);
				}
			});
			return labels;
		} else {
			let labels = [];
			datas.forEach((data) => {
				labels.push(monthLabelsList[(data._id.month - 1)] + " " + data._id.year);
			});
			return labels;
		}
	}

	function sort_unique(arr) {
		if (arr.length === 0) return arr;
		arr = arr.sort(function (a, b) { return a * 1 - b * 1; });
		var ret = [arr[0]];
		for (var i = 1; i < arr.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
			if (arr[i - 1] !== arr[i]) {
				ret.push(arr[i]);
			}
		}
		return ret;
	}

	const chartDataList = (datas, category) => {
		if (category === "brgyDumpsTimelineClean" || category === "brgyDumpsTimelineUnclean") {
			let months = [];
			let cleanedDumpsMonths = []
			let uncleanedDumpsDumpsMonths = []
			let labels = [];

			for (let i = 0; i < cleanedDumps.length; i++) {
				months.push(String(cleanedDumps[i]._id.month).concat(cleanedDumps[i]._id.year))
				cleanedDumpsMonths.push(String(cleanedDumps[i]._id.month).concat(cleanedDumps[i]._id.year))
			}
			for (let i = 0; i < uncleanedDumps.length; i++) {
				months.push(String(uncleanedDumps[i]._id.month).concat(uncleanedDumps[i]._id.year))
				uncleanedDumpsDumpsMonths.push(String(uncleanedDumps[i]._id.month).concat(uncleanedDumps[i]._id.year))
			}

			const monthPolish = sort_unique(months)

			let nodata

			if (category === "brgyDumpsTimelineClean") {
				nodata = monthPolish.filter(x => !cleanedDumpsMonths.includes(x));
			} else {
				nodata = monthPolish.filter(x => !uncleanedDumpsDumpsMonths.includes(x));
			}
			// console.log("monthPolish",monthPolish)
			// console.log(category, nodata)


			for (let i = 0; i < monthPolish.length; i++) {
				const mon = monthPolish[i]

				if (nodata.includes(mon)) {
					labels.push(0);
				} else {

					datas.forEach((data) => {
						if (String(data._id.month).concat(data._id.year) === mon) {
							labels.push(data.total);
						}
					});
				}

			}

			console.log("labels", labels)
			return (labels)

		}
		else if (category === "barangaysOrDistrictStatusesUndone") {
			let labels = [];
			datas.forEach((data) => {
				labels.push(data.statuses.unCleanDumps);
				console.log("data", data)
			});
			return labels;

		}
		else if (category === "barangaysOrDistrictStatusesDone") {
			let labels = [];
			datas.forEach((data) => {
				labels.push(data.statuses.cleanDumps);
				console.log("data", data)
			});
			return labels;

		}
		else {
			let labels = [];
			datas.forEach((data) => {
				labels.push(data.total);
			});
			return labels;
		}
	}

	ChartJS.register(
		CategoryScale,
		LinearScale,
		ArcElement,
		PointElement,
		LineElement,
		BarElement,
		Filler,
		Title,
		Tooltip,
		Legend
	);

	let uncleanedDumpsData = {
		labels: (uncleanedDumps && chartLabel(uncleanedDumps)),
		datasets: [
			{
				label: '# of Cleaned Dumps',
				data: (cleanedDumps && chartDataList(cleanedDumps, "brgyDumpsTimelineClean")),
				backgroundColor: [
					'rgba(71, 168, 128, 0.2)',
				],
				borderColor: [
					'rgb(71, 168, 128)'
				],
				borderWidth: 3,
				lineTension: .3,
				fill: false,

			},
			{
				label: '# of Uncleaned Dumps',
				data: (uncleanedDumps && chartDataList(uncleanedDumps, "brgyDumpsTimelineUnclean")),
				backgroundColor: [
					'rgba(71, 168, 128, 0.2)',
				],
				borderColor: [
					'rgb(255, 97, 79)'
				],
				borderWidth: 3,
				lineTension: .3,
				fill: false,
			}
		],
	};

	let barangaysOrDistrictStatusesData = {
		labels: (barangaysOrDistrictStatuses && chartLabel(barangaysOrDistrictStatuses, "barangaysOrDistrictStatuses")),
		datasets: [
			{
				label: 'Uncleaned Illegal Dumps',
				data: (barangaysOrDistrictStatuses && chartDataList(barangaysOrDistrictStatuses, "barangaysOrDistrictStatusesUndone")),
				backgroundColor: [
					'rgba(255, 97, 79, 0.2)',
				],
				borderColor: [
					'rgb(255, 97, 79)'
				],
				borderWidth: 2,
			},
			{
				label: 'Cleaned Illegal Dumps',
				data: (barangaysOrDistrictStatuses && chartDataList(barangaysOrDistrictStatuses, 'barangaysOrDistrictStatusesDone')),
				backgroundColor: [
					'rgba(71, 168, 128, 0.2)'
				],
				borderColor: [
					'rgb(71, 168, 128)'
				],
				borderWidth: 1,
			}
		],
	};


	const cleanedDumpsSubmitDate = () => {
		if (!cdStartDate || !cdEndDate) {
			alert.error("Invalid Input, Empty Date")
		} else {
			if (cdStartDate > cdEndDate) {
				alert.error("Invalid Input, Start Date is Ahead of End Date")
			}
			else {
				const formDataCleanedDumps = new FormData();
				formDataCleanedDumps.set('cdStartDate', cdStartDate);
				formDataCleanedDumps.set('cdEndDate', cdEndDate);
				dispatch(getCleanedDumps(formDataCleanedDumps))
			}

		}
	}

	const uncleanedDumpsSubmitDate = () => {
		if (!udStartDate || !udEndDate) {
			alert.error("Invalid Input, Empty Date")
		} else {
			if (udStartDate > udEndDate) {
				alert.error("Invalid Input, Start Date is Ahead of End Date")
			}
			else {
				const formDataUncleanedDumps = new FormData();
				formDataUncleanedDumps.set('udStartDate', udStartDate);
				formDataUncleanedDumps.set('udEndDate', udEndDate);
				dispatch(getUncleanedDumps(formDataUncleanedDumps))

				const formDataCleanedDumps = new FormData();
				formDataCleanedDumps.set('cdStartDate', udStartDate);
				formDataCleanedDumps.set('cdEndDate', udEndDate);
				dispatch(getCleanedDumps(formDataCleanedDumps))
			}

		}
	}
	const barangaysOrDistrictStatusesDate = () => {
		if (rpbStartDate > rpbEndDate) {
			alert.error("Invalid Input, Start Date is Ahead of End Date")
		}
		else {
			const formDataRanking = new FormData();
			const dateToday = new Date();

			formDataRanking.set('rpbStartDate', rpbStartDate ? rpbStartDate : '2022-01-01');
			formDataRanking.set('rpbEndDate', rpbEndDate ? rpbEndDate : (dateToday.getFullYear() + 1) + '-01-01');
			formDataRanking.set('cluster', cluster);
			if (barangay) {
				formDataRanking.set('barangay', barangay);
			}
			if (cluster === "$district") {
				setApplyCluster("District")
			} else {
				setApplyCluster("Barangay")
			}

			dispatch(rankings(formDataRanking))
		}


	}



	const cleanedDumpsReset = () => {
		const formDataCleanedDumps = new FormData();
		const dateToday = new Date();
		formDataCleanedDumps.set('cdStartDate', '2022-01-01');
		formDataCleanedDumps.set('cdEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getCleanedDumps(formDataCleanedDumps))
	}

	const uncleanedDumpsReset = () => {
		const formDataUncleanedDumps = new FormData();
		const dateToday = new Date();
		formDataUncleanedDumps.set('udStartDate', '2022-01-01');
		formDataUncleanedDumps.set('udEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getUncleanedDumps(formDataUncleanedDumps))

		const formDataCleanedDumps = new FormData();
		formDataCleanedDumps.set('cdStartDate', '2022-01-01');
		formDataCleanedDumps.set('cdEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getCleanedDumps(formDataCleanedDumps))
	}

	const barangaysOrDistrictStatusesReset = () => {
		const formDataRanking = new FormData();
		const dateToday = new Date();
		setRpbStartDate('')
		setRpbEndDate('')

		setCluster("$barangay")
		setApplyCluster("Barangay")
		formDataRanking.set('cluster', '$barangay');
		formDataRanking.set('rpbStartDate', '2022-01-01');
		formDataRanking.set('rpbEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		if (barangay) {
			formDataRanking.set('barangay', barangay);
		}
		dispatch(rankings(formDataRanking))
	}


	const numberWithCommas = (x) => {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	let brgyRank = 0
	let brgyCounter = 0
	return (
		<Fragment>
			<MetaData title={`Dashboard`} />
			<div className="bh-dashboard">
				<div className="m-0">
					<SidebarBarangay />
				</div>
				<div className="charts">
					<h3 className="text-center">Barangay {user && user.barangay}</h3>
					<div className="row px-2">
						<div className="col-md">
							<div className="bh-dashboard-total t-users">
								<p className="title">Total Users</p>
								<p className="text-end fw-bold m-0"><span className="float-start bi bi-people-fill"></span>{numberWithCommas(usersTotal)}</p>
							</div>
						</div>
						<div className="col-md">
							<div className="bh-dashboard-total t-dumps">
								<p className="title">Total Reported Illegal Dumps</p>
								<p className="text-end fw-bold m-0"><span className="float-start bi bi-trash-fill"></span>{numberWithCommas(dumpsTotal)}</p>
							</div>
						</div>
						<div className="col-md">
							<div className="bh-dashboard-total t-donations">
								{mostReportedBrgyDone && mostReportedBrgyDone.map((dumpDone) => {
									brgyCounter += 1
									if (dumpDone._id === user.barangay) {
										brgyRank = brgyCounter
									}
								})
								}
								<p className="title">Rank in City:</p>
								<p className="text-end fw-bold m-0"><span className="float-start bi bi-bar-chart-fill"></span>{brgyRank}</p>
							</div>
						</div>
					</div>
					<div className="container-fluid">
						<div className="row" style={{ margin: "30px 0 12px 0" }}>
							<div style={{ height: "50vh" }} className="col-sm-6">
								<div className="bh-comment showBtn" style={{ background: "white", border: "1px solid #d3d3d3" }}>
									{/* For Uncleaned Dumps Chart */}
									<div>
										<input id="udStartDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "30px", width: "125px", fontSize: "12px" }} name="udStartDate" onChange={(e) => setUdStartDate(e.target.value)} defaultValue={udStartDate} className="form-control" />
										<input id="udEndDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "30px", width: "125px", fontSize: "12px" }} name="udEndDate" onChange={(e) => setUdEndDate(e.target.value)} defaultValue={udEndDate} className="form-control" />
										<button className="btn" onClick={() => { uncleanedDumpsReset(); document.getElementById("udStartDate").value = ""; document.getElementById("udEndDate").value = "" }}
											style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", height: "30px", fontSize: "12px" }}>Reset
										</button>
										&nbsp;
										<button className="btn" onClick={uncleanedDumpsSubmitDate}
											style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", height: "30px", fontSize: "12px" }}>Apply
										</button>
									</div>
									
									<Line
										options={{
											responsive: true,
											plugins: {
												legend: {
													display: false,
												},
												title: {
													display: true,
													text: `All Reported Illegal Dump Sites in Brgy. ${user && user.barangay}`,
												},
											},
											scales: {
												x: {
													grid: {
														display: false
													}
												},
												y: {
													grid: {
														display: false
													}
												}
											}
										}}

										data={uncleanedDumpsData}
									/>
									
								</div>
							</div>
							<div style={{ height: "50vh" }} className="col-sm-6">
								<div className="bh-comment showBtn" style={{ background: "white", border: "1px solid #d3d3d3" }}>
									{/* For most Reported Brgy Done Chart */}
									<div>
										<div className='row' style={{ margin: "auto" }}>
											<input id="rpbStartDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "20px", width: "100px", fontSize: "10px" }} name="rpbStartDate" onChange={(e) => setRpbStartDate(e.target.value)} defaultValue={rpbStartDate} className="form-control" />
											<input id="rpbEndDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "20px", width: "100px", fontSize: "10px" }} name="rpbEndDate" onChange={(e) => setRpbEndDate(e.target.value)} defaultValue={rpbEndDate} className="form-control" />
											<select value={cluster} onChange={(e) => { setCluster(e.target.value) }} style={{ marginLeft: "2px", position: "relative", padding: "0px", height: "20px", width: "fit-content", fontSize: "10px" }} className="form-control">
												<option value="$barangay">Barangays</option>
												<option value="$district">District</option>
											</select>
											<button className="btn" onClick={barangaysOrDistrictStatusesDate}
												style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", width: "35px", fontSize: "10px", padding: "0px" }}>Apply
											</button>
											&nbsp;
											<button className="btn" onClick={() => { barangaysOrDistrictStatusesReset(); document.getElementById("rpbStartDate").value = ""; document.getElementById("rpbEndDate").value = "" }}
												style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", width: "35px", fontSize: "10px", padding: "0px" }}>Reset
											</button>
										</div>
									</div>
									{rankingLoading ? <Fragment><br /><div> <img src='/images/1487.gif' style={{ display: "block", margin: "auto" }} /></div></Fragment> :
									<Bar
										options={{
											responsive: true,
											plugins: {
												legend: {
													display: false,
												},
												title: {
													display: true,
													text: 'Barangays with Most Cleaned Illegal Dumps',
												},
											},
											scales: {
												x: {
													grid: {
														display: false
													},
													stacked: true,
												},
												y: {
													grid: {
														display: false
													},
													stacked: true,
												}
											}
										}}
										data={barangaysOrDistrictStatusesData}
									/>
									}
								</div>
							</div>
						</div>

					</div>

				</div>
			</div>
		</Fragment>
	)
}

export default BarangayDashboard