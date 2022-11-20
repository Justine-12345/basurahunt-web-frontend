import React, { Fragment, useEffect, useState } from 'react';
// import {Link} from 'react-router-dom';
import Sidebar from '../../components/layouts/sidebar';
import MetaData from '../../components/layouts/MetaData'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getReportsPerCategory, getDonationsPerCategory, getTotalUsers, getTotalDumps, getTotalDonations, getDonatedItems, getCleanedDumps, getUncleanedDumps, getCollectionPerTruck, getCollectionPoints, clearErrors } from '../../actions/dashboardActions'
import { rankings } from '../../actions/dumpActions'
import Loading from '../layouts/LoaderNoBg'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
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

const Dashboard = () => {
	const monthLabelsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const [diStartDate, setDiStartDate] = useState('');
	const [diEndDate, setDiEndDate] = useState('');
	const [cdStartDate, setCdStartDate] = useState('');
	const [cdEndDate, setCdEndDate] = useState('');
	const [udStartDate, setUdStartDate] = useState('');
	const [udEndDate, setUdEndDate] = useState('');
	const [cptStartDate, setCptStartDate] = useState('');
	const [cptEndDate, setCptEndDate] = useState('');
	const [cpStartDate, setCpStartDate] = useState('');
	const [cpEndDate, setCpEndDate] = useState('');

	// const [mrdStartDate, setMrdStartDate] = useState('');
	// const [mrdEndDate, setMrdEndDate] = useState('');

	// const [mruStartDate, setMruStartDate] = useState('');
	// const [mruEndDate, setMruEndDate] = useState('');

	const [rpbStartDate, setRpbStartDate] = useState('');
	const [rpbEndDate, setRpbEndDate] = useState('');

	const [barangay, setBarangay] = useState('');

	const [rcStartDate, setRcStartDate] = useState('');
	const [rcEndDate, setRcEndDate] = useState('');

	const [dcStartDate, setDcStartDate] = useState('');
	const [dcEndDate, setDcEndDate] = useState('');

	const [cluster, setCluster] = useState('$barangay');
	const [applyCluster, setApplyCluster] = useState("Barangay");

	const [clusterDonatedItems, setClusterDonatedItems] = useState('');
	const [applyClusterItems, setApplyClusterItems] = useState("Timeline");

	const [clusterWastePerTruck, setClusterWastePerTruck] = useState('');
	const [applyClusterWastePerTruck, setApplyClusterWastePerTruck] = useState("Timeline");

	const [clusterCollectionPoint, setClusterCollectionPoint] = useState('');
	const [applyClusterCollectionPoint, setApplyClusterCollectionPoint] = useState("Timeline");

	const alert = useAlert();
	const dispatch = useDispatch();
	const { error: usersTotalError, usersTotal } = useSelector(state => state.usersTotal);
	const { error: dumpsTotalError, dumpsTotal } = useSelector(state => state.dumpsTotal);
	const { error: donationsTotalError, donationsTotal } = useSelector(state => state.donationsTotal);
	const { error: cleanedDumpsError, cleanedDumps } = useSelector(state => state.cleanedDumps);
	const { error: uncleanedDumpsError, uncleanedDumps, AllDumps, loading: uncleanedDumpsLoading } = useSelector(state => state.uncleanedDumps);
	const { error: donatedItemsError, donatedItems, loading: donatedItemsLoading } = useSelector(state => state.donatedItems);
	const { error: wasteCollectionPerTruckError, collectionPerTruck, loading: wasteCollectionPerTruckLoading } = useSelector(state => state.wasteCollectionPerTruck);
	const { error: collectionPointError, collectionPoint, loading: collectionPointLoading } = useSelector(state => state.collectionPointDash);
	const { error: rankingError, barangaysOrDistrictStatuses, topUserForAdmin, loading: rankingLoading } = useSelector(state => state.ranking)

	const { error: reportsPerCategoryError, reportsPerCategory } = useSelector(state => state.reportsPerCategory);
	const { error: donationsPerCategoryError, donationsPerCategory } = useSelector(state => state.donationsPerCategory);

	useEffect(() => {
		dispatch(getTotalUsers());
		dispatch(getTotalDumps());
		dispatch(getTotalDonations());
		dispatch(rankings());

		const dateToday = new Date();

		const formDataDonatedItems = new FormData();
		formDataDonatedItems.set('diStartDate', '2022-01-01');
		formDataDonatedItems.set('diEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getDonatedItems(formDataDonatedItems))

		const formDataCleanedDumps = new FormData();
		formDataCleanedDumps.set('cdStartDate', '2022-01-01');
		formDataCleanedDumps.set('cdEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getCleanedDumps(formDataCleanedDumps))

		const formDataUncleanedDumps = new FormData();
		formDataUncleanedDumps.set('udStartDate', '2022-01-01');
		formDataUncleanedDumps.set('udEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getUncleanedDumps(formDataUncleanedDumps))

		const formDataWasteMass = new FormData();
		formDataWasteMass.set('cptStartDate', '2022-01-01');
		formDataWasteMass.set('cptEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getCollectionPerTruck(formDataWasteMass))

		const formDataCollectionPoimt = new FormData();
		formDataCollectionPoimt.set('cpStartDate', '2022-01-01');
		formDataCollectionPoimt.set('cpEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getCollectionPoints(formDataCollectionPoimt))


		const formDataRanking = new FormData();
		formDataRanking.set('rpbStartDate', '2022-01-01');
		formDataRanking.set('rpbEndDate', (dateToday.getFullYear() + 1) + '-01-01');

		dispatch(rankings(formDataRanking))


		const formDataReportsPerCategory = new FormData();
		formDataReportsPerCategory.set('rcStartDate', '2022-01-01');
		formDataReportsPerCategory.set('rcEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getReportsPerCategory(formDataReportsPerCategory))


		const formDonationsPerCategory = new FormData();
		formDonationsPerCategory.set('dcStartDate', '2022-01-01');
		formDonationsPerCategory.set('dcEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getDonationsPerCategory(formDonationsPerCategory))


		if (usersTotalError) {
			alert.error(usersTotalError);
			dispatch(clearErrors())
		}

		if (dumpsTotalError) {
			alert.error(dumpsTotalError);
			dispatch(clearErrors())
		}

		if (donationsTotalError) {
			alert.error(donationsTotalError);
			dispatch(clearErrors())
		}

		if (donatedItemsError) {
			alert.error(donatedItemsError);
			dispatch(clearErrors())
		}

		if (wasteCollectionPerTruckError) {
			alert.error(wasteCollectionPerTruckError);
			dispatch(clearErrors())
		}

		if (collectionPointError) {
			alert.error(collectionPointError);
			dispatch(clearErrors())
		}

		if (rankingError) {
			alert.error(rankingError);
			dispatch(clearErrors())
		}

		if (reportsPerCategoryError) {
			alert.error(reportsPerCategoryError);
			dispatch(clearErrors())
		}

		if (donationsPerCategoryError) {
			alert.error(donationsPerCategoryError);
			dispatch(clearErrors())
		}

	}, [dispatch, donationsPerCategoryError, reportsPerCategoryError, usersTotalError, dumpsTotalError, donationsTotalError, donatedItemsError, wasteCollectionPerTruckError, rankingError, collectionPointError, alert]);

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
		} else if (category === 'topUser') {
			let labels = [];
			datas.forEach((data) => {
				labels.push(data._id.alias);
			});
			return labels;
		}
		else if (category === 'reportPerCategory') {
			let labels = [];
			datas.forEach((data) => {
				labels.push(data._id.waste_type);
			});
			return labels;
		}
		else if (category === 'donationPerCategory') {
			let labels = [];
			datas.forEach((data) => {
				labels.push(data._id.item_type);
			});
			return labels;
		}
		else if (category === 'brgyFilter') {
			let labels = [];
			datas.forEach((data) => {
				labels.push(data._id);
			});
			return labels;
		}
		else if (category === 'districtFilter') {
			let labels = [];
			datas.forEach((data) => {
				labels.push("District #" + data._id);
			});
			return labels;
		}
		else {
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

		if (category === 'topUser') {
			let labels = [];
			datas.forEach((data) => {
				labels.push(data._id.level);
			});
			return labels;
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
		else if(category === "brgyDumpsTimelineClean" || category === "brgyDumpsTimelineUnclean"){
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

			if(category === "brgyDumpsTimelineClean"){
			 nodata = monthPolish.filter(x => !cleanedDumpsMonths.includes(x));
			}else{
			 nodata = monthPolish.filter(x => !uncleanedDumpsDumpsMonths.includes(x));	
			}

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
			return(labels)

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
				label: '# of Uncleaned Illegal Dumps',
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
			},
			{
				label: '# of Cleaned Illegal Dumps',
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
				label: '# of All Illegal Dumps',
				data: (AllDumps && chartDataList(AllDumps)),
				backgroundColor: [
					'rgba(250, 187, 0, 0.2)',
				],
				borderColor: [
					'rgb(250, 187, 0)'
				],
				borderWidth: 3,
				lineTension: .3,
				fill: false,
			}
		],
	};

	let donatedItemsData = {
		labels: (donatedItems && chartLabel(donatedItems, applyClusterItems === "Barangay" ? "brgyFilter" : applyClusterItems === "District" ? "districtFilter" : "")),
		datasets: [
			{
				label: '# of Donated Items',
				data: (donatedItems && chartDataList(donatedItems)),
				backgroundColor: [
					'rgba(71, 168, 128, 0.2)',
				],
				borderColor: [
					'rgb(71, 168, 128)'
				],
				borderWidth: 3,
				lineTension: .3,
				fill: false,
			}
		],
	};

	let wasteCollectionPerTruckData = {
		labels: (collectionPerTruck && chartLabel(collectionPerTruck, applyClusterWastePerTruck === "Barangay" ? "brgyFilter" : applyClusterWastePerTruck === "District" ? "districtFilter" : "")),
		datasets: [
			{
				label: 'Collected Waste Per Truck',
				data: (collectionPerTruck && chartDataList(collectionPerTruck)),
				backgroundColor: [
					'rgba(71, 168, 128, 0.2)',
				],
				borderColor: [
					'rgb(71, 168, 128)'
				],
				borderWidth: 3,
				lineTension: .3,
				fill: false,
			}
		],
	};


	let reportsPerCategoryData = {
		labels: (reportsPerCategory && chartLabel(reportsPerCategory, "reportPerCategory")),
		datasets: [
			{
				label: 'Reports Per Category',
				data: (reportsPerCategory && chartDataList(reportsPerCategory)),
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(255, 159, 64, 0.2)',
					'rgba(255, 205, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(201, 203, 207, 0.2)'
				],
				borderColor: [
					'rgb(255, 99, 132)',
					'rgb(255, 159, 64)',
					'rgb(255, 205, 86)',
					'rgb(75, 192, 192)',
					'rgb(54, 162, 235)',
					'rgb(153, 102, 255)',
					'rgb(201, 203, 207)'
				],
				borderWidth: 3,
				lineTension: .3,
				fill: false,
			}
		],
	};



	let donationsPerCategoryData = {
		labels: (donationsPerCategory && chartLabel(donationsPerCategory, "donationPerCategory")),
		datasets: [
			{
				label: 'Donations Per Category',
				data: (donationsPerCategory && chartDataList(donationsPerCategory)),
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(255, 159, 64, 0.2)',
					'rgba(255, 205, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(201, 203, 207, 0.2)'
				],
				borderColor: [
					'rgb(255, 99, 132)',
					'rgb(255, 159, 64)',
					'rgb(255, 205, 86)',
					'rgb(75, 192, 192)',
					'rgb(54, 162, 235)',
					'rgb(153, 102, 255)',
					'rgb(201, 203, 207)'
				],
				borderWidth: 3,
				lineTension: .3,
				fill: false,
			}
		],
	};

	let collectionPointData = {
		labels: (collectionPoint && chartLabel(collectionPoint, applyClusterCollectionPoint === "Barangay" ? "brgyFilter" : applyClusterCollectionPoint === "District" ? "districtFilter" : "")),
		datasets: [
			{
				label: '# Of Collection Points',
				data: (collectionPoint && chartDataList(collectionPoint)),
				backgroundColor: [
					'rgba(71, 168, 128, 0.2)',
				],
				borderColor: [
					'rgb(71, 168, 128)'
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


	let topUserForAdminData = {
		labels: (topUserForAdmin && chartLabel(topUserForAdmin, "topUser")),
		datasets: [
			{
				label: 'Level',
				data: (topUserForAdmin && chartDataList(topUserForAdmin, "topUser")),
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(255, 159, 64, 0.2)',
					'rgba(255, 205, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(201, 203, 207, 0.2)'
				],
				borderColor: [
					'rgb(255, 99, 132)',
					'rgb(255, 159, 64)',
					'rgb(255, 205, 86)',
					'rgb(75, 192, 192)',
					'rgb(54, 162, 235)',
					'rgb(153, 102, 255)',
					'rgb(201, 203, 207)'
				],
				borderWidth: 2,
			}
		],
	};

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

	const reportsPerCategorySubmitDate = () => {
		if (!rcStartDate || !rcEndDate) {
			alert.error("Invalid Input, Empty Date")
		} else {
			if (rcStartDate > rcEndDate) {
				alert.error("Invalid Input, Start Date is Ahead of End Date")
			}
			else {
				const formDataReportsPerCategory = new FormData();
				formDataReportsPerCategory.set('rcStartDate', rcStartDate);
				formDataReportsPerCategory.set('rcEndDate', rcEndDate);
				dispatch(getReportsPerCategory(formDataReportsPerCategory))
			}

		}
	}



	const donationsPerCategorySubmitDate = () => {
		if (!dcStartDate || !dcEndDate) {
			alert.error("Invalid Input, Empty Date")
		} else {
			if (dcStartDate > dcEndDate) {
				alert.error("Invalid Input, Start Date is Ahead of End Date")
			}
			else {
				const formDataDonationPerCategory = new FormData();
				formDataDonationPerCategory.set('dcStartDate', dcStartDate);
				formDataDonationPerCategory.set('dcEndDate', dcEndDate);
				dispatch(getDonationsPerCategory(formDataDonationPerCategory))
			}

		}
	}




	const donatedItemsSubmitDate = () => {

		setApplyClusterItems(clusterDonatedItems === "$barangay_hall" ?
			"Barangay" : clusterDonatedItems === "$district" ?
				"District" : clusterDonatedItems === "" ? "Timeline" : ""
		)
		if (diStartDate > diEndDate) {
			alert.error("Invalid Input, Start Date is Ahead of End Date")
		}
		else {
			const dateToday = new Date();
			const formDataDonatedItems = new FormData();

			if (!diStartDate || !diEndDate) {
				formDataDonatedItems.set('diStartDate', '2022-01-01');
				formDataDonatedItems.set('diEndDate', (dateToday.getFullYear() + 1) + '-01-01');
			} else {
				formDataDonatedItems.set('diStartDate', diStartDate);
				formDataDonatedItems.set('diEndDate', diEndDate);
			}

			formDataDonatedItems.set('cluster', clusterDonatedItems);
			dispatch(getDonatedItems(formDataDonatedItems))
		}


	}


	const collectionPerTruckSubmitDate = () => {

		setApplyClusterWastePerTruck(clusterWastePerTruck === "$barangay" ?
			"Barangay" : clusterWastePerTruck === "$district" ?
				"District" : clusterWastePerTruck === "" ? "Timeline" : ""
		)

		if (cptStartDate > cptEndDate) {
			alert.error("Invalid Input, Start Date is Ahead of End Date")
		}
		else {
			const formDataWasteMass = new FormData();
			const dateToday = new Date();
			if (!cptStartDate || !cptEndDate) {
				formDataWasteMass.set('cptStartDate', '2022-01-01');
				formDataWasteMass.set('cptEndDate', (dateToday.getFullYear() + 1) + '-01-01');
			} else {
				formDataWasteMass.set('cptStartDate', cptStartDate);
				formDataWasteMass.set('cptEndDate', cptEndDate);
			}

			formDataWasteMass.set('cluster', clusterWastePerTruck);

			dispatch(getCollectionPerTruck(formDataWasteMass))
		}


	}

	const collectionPointSubmitDate = () => {

		setApplyClusterCollectionPoint(clusterCollectionPoint === "$barangay" ?
			"Barangay" : clusterCollectionPoint === "$district" ?
				"District" : clusterCollectionPoint === "" ? "Timeline" : ""
		)

		if (cpStartDate > cpEndDate) {
			alert.error("Invalid Input, Start Date is Ahead of End Date")
		}
		else {
			const formDataCollectionPoimt = new FormData();
			const dateToday = new Date();

			if (!cpStartDate || !cpEndDate) {
				formDataCollectionPoimt.set('cpStartDate', '2022-01-01');
				formDataCollectionPoimt.set('cpEndDate', (dateToday.getFullYear() + 1) + '-01-01');
			} else {
				formDataCollectionPoimt.set('cpStartDate', cpStartDate);
				formDataCollectionPoimt.set('cpEndDate', cpEndDate);
			}

			formDataCollectionPoimt.set('cluster', clusterCollectionPoint);

			dispatch(getCollectionPoints(formDataCollectionPoimt))
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


	const topUserForAdminDate = () => {
		if (!barangay) {
			alert.error("Invalid Input, Please Select Barangay")
		} else {
			const formDataRanking = new FormData();
			const dateToday = new Date();
			formDataRanking.set('rpbStartDate', rpbStartDate ? rpbStartDate : '2022-01-01');
			formDataRanking.set('rpbEndDate', rpbEndDate ? rpbEndDate : (dateToday.getFullYear() + 1) + '-01-01');
			formDataRanking.set('barangay', barangay);
			dispatch(rankings(formDataRanking))
		}
	}

	const uncleanedDumpsReset = () => {
		const dateToday = new Date();

		const formDataUncleanedDumps = new FormData();
		formDataUncleanedDumps.set('udStartDate', '2022-01-01');
		formDataUncleanedDumps.set('udEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getUncleanedDumps(formDataUncleanedDumps))

		const formDataCleanedDumps = new FormData();
		formDataCleanedDumps.set('cdStartDate', '2022-01-01');
		formDataCleanedDumps.set('cdEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getCleanedDumps(formDataCleanedDumps))
	}


	const reportsPerCategoryReset = () => {
		const formDataReportsCategoryReset = new FormData();
		const dateToday = new Date();
		formDataReportsCategoryReset.set('rcStartDate', '2022-01-01');
		formDataReportsCategoryReset.set('rcEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getReportsPerCategory(formDataReportsCategoryReset))
	}

	const donationsPerCategoryReset = () => {
		const formDataDonationsCategoryReset = new FormData();
		const dateToday = new Date();
		formDataDonationsCategoryReset.set('dcStartDate', '2022-01-01');
		formDataDonationsCategoryReset.set('dcEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getDonationsPerCategory(formDataDonationsCategoryReset))
	}



	const donatedItemsReset = () => {
		setApplyClusterItems("Timeline")
		setClusterDonatedItems("")
		const formDataDonatedItems = new FormData();
		const dateToday = new Date();
		formDataDonatedItems.set('diStartDate', '2022-01-01');
		formDataDonatedItems.set('diEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getDonatedItems(formDataDonatedItems))
	}

	const collectionPerTruckReset = () => {
		setApplyClusterWastePerTruck("Timeline")
		setClusterWastePerTruck("")
		const formDataWasteMass = new FormData();
		const dateToday = new Date();
		formDataWasteMass.set('cptStartDate', '2022-01-01');
		formDataWasteMass.set('cptEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getCollectionPerTruck(formDataWasteMass))
	}

	const collectionPointReset = () => {
		setApplyClusterCollectionPoint("Timeline")
		setClusterCollectionPoint("")
		const formDataCollectionPoimt = new FormData();
		const dateToday = new Date();
		formDataCollectionPoimt.set('cpStartDate', '2022-01-01');
		formDataCollectionPoimt.set('cpEndDate', (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(getCollectionPoints(formDataCollectionPoimt))
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


	const topUserForAdminReset = () => {
		const formDataRanking = new FormData();
		const dateToday = new Date();
		setBarangay('')
		formDataRanking.set('rpbStartDate', rpbStartDate ? rpbStartDate : '2022-01-01');
		formDataRanking.set('rpbEndDate', rpbEndDate ? rpbEndDate : (dateToday.getFullYear() + 1) + '-01-01');
		dispatch(rankings(formDataRanking))
	}

	const numberWithCommas = (x) => {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	return (
		<Fragment>
			<MetaData title={"Dashboard"} />
			<div className="bh-dashboard">
				<div className="m-0">
					<Sidebar />
				</div>
				<div className="charts">
					<div className="row px-2" style={{ marginBottom: "6px" }}>
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
								<p className="title">Total Donations</p>

								<p className="text-end fw-bold m-0"><span className="float-start bi bi-box2-fill"></span>{numberWithCommas(donationsTotal)}</p>
							</div>
						</div>
					</div>
					<div className="container-fluid">

						<div className="row" style={{ boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)", paddingTop: "6px", paddingBottom: "6px", backgroundColor: "white", height: "fit-content" }}>

							<div style={{ height: "70vh", borderLeft: "1px solid #e6e6e6" }} className="col-xl-4">
								{/* For most Reported Brgy Done Chart */}

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

								<div style={{ height: "65vh" }}>
									{rankingLoading ? <Fragment><br /><div> <img src='/images/1487.gif' style={{ display: "block", margin: "auto" }} /></div></Fragment> :
										<Bar style={{ height: "100%" }}
											options={{
												responsive: true,
												plugins: {
													legend: {
														display: true,
													},
													title: {
														display: true,
														text: `Illegal Dumps Per ${applyCluster}`,
													},
												},
												scales: {
													x: {
														grid: {
															display: false,
														},
														stacked: true,
													},
													y: {
														grid: {
															display: false,
														},
														stacked: true,
													}
												}
												, maintainAspectRatio: false,
												indexAxis: 'y'
											}}
											data={barangaysOrDistrictStatusesData}
										/>
									}
								</div>
							</div>



							<div style={{ borderLeft: "1px solid #e6e6e6" }} className="col-xl-4">
								<div className='row' style={{ width: "100%", margin: "auto" }}>
									<div style={{ height: "35vh", borderRight: "0px solid #e6e6e6" }} className="col-xl-12">

										<div>
											<input id="udStartDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "20px", width: "100px", fontSize: "10px" }} name="udStartDate" onChange={(e) => setUdStartDate(e.target.value)} defaultValue={udStartDate} className="form-control" />
											<input id="udEndDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "20px", width: "100px", fontSize: "10px" }} name="udEndDate" onChange={(e) => setUdEndDate(e.target.value)} defaultValue={udEndDate} className="form-control" />
											<button className="btn" onClick={() => { uncleanedDumpsReset(); document.getElementById("udStartDate").value = ""; document.getElementById("udEndDate").value = "" }}
												style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", width: "35px", fontSize: "10px", padding: "0px" }}>Reset
											</button>
											&nbsp;
											<button className="btn" onClick={uncleanedDumpsSubmitDate}
												style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", width: "35px", fontSize: "10px", padding: "0px" }}>Apply
											</button>
										</div>
										<div style={{ height: "30vh" }}>
											{uncleanedDumpsLoading ? <Fragment><br /><div> <img src='/images/1487.gif' style={{ display: "block", margin: "auto" }} /></div></Fragment> :
												<Line style={{ height: "100%" }}
													options={{
														responsive: true,
														plugins: {
															legend: {
																display: true,
															},
															title: {
																display: true,
																text: 'Illegal Dump Sites',
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
														, maintainAspectRatio: false
													}}

													data={uncleanedDumpsData}
												/>
											}
										</div>

									</div>
								</div>
								<hr style={{ height: "0px", padding: "0", margin: "0", position: "relative", bottom: "8px" }} />
								<div className='row' style={{ width: "100%", margin: "auto" }}>
									<div style={{ height: "35vh", borderRight: "0px solid #e6e6e6" }} className="col-xl-12">
										<div>
											<div className='row'>
												<input id="diStartDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "20px", width: "100px", fontSize: "10px" }} name="diStartDate" onChange={(e) => setDiStartDate(e.target.value)} defaultValue={diStartDate} className="form-control" />
												<input id="diEndDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "20px", width: "100px", fontSize: "10px" }} name="diEndDate" onChange={(e) => setDiEndDate(e.target.value)} defaultValue={diEndDate} className="form-control" />
												<select value={clusterDonatedItems} onChange={(e) => { setClusterDonatedItems(e.target.value) }} style={{ marginLeft: "2px", position: "relative", padding: "0px", height: "20px", width: "fit-content", fontSize: "10px" }} className="form-control">
													<option value="">Timeline</option>
													<option value="$barangay_hall">Barangays</option>
													<option value="$district">District</option>
												</select>
												<button className="btn" onClick={donatedItemsSubmitDate}
													style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", width: "35px", fontSize: "10px", padding: "0px" }}>Apply
												</button>
												&nbsp;
												<button className="btn" onClick={() => { donatedItemsReset(); document.getElementById("diStartDate").value = ""; document.getElementById("diEndDate").value = "" }}
													style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", width: "35px", fontSize: "10px", padding: "0px" }}>Reset
												</button>
											</div>
										</div>
										<div style={{ height: "30vh" }}>
											{donatedItemsLoading ? <Fragment><br /><div> <img src='/images/1487.gif' style={{ display: "block", margin: "auto" }} /></div></Fragment> :
												(
													applyClusterItems === "Timeline" ?
														<Line style={{ height: "100%" }}
															options={{
																responsive: true,
																plugins: {
																	legend: {
																		display: false,
																	},
																	title: {
																		display: true,
																		text: 'Donated Items Chart',
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
																},
																maintainAspectRatio: false
															}}
															data={donatedItemsData}
														/> :
														<Bar style={{ height: "100%" }}
															options={{
																responsive: true,
																plugins: {
																	legend: {
																		display: false,
																	},
																	title: {
																		display: true,
																		text: 'Donated Items Chart',
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
																},
																maintainAspectRatio: false
															}}
															data={donatedItemsData}
														/>
												)

											}

										</div>
									</div>
								</div>
							</div>


							<div style={{ borderLeft: "1px solid #e6e6e6" }} className="col-xl-4">
								<div className='row' style={{ width: "100%", margin: "auto" }}>
									<div style={{ height: "35vh" }} className="col-xl-12">
										<div>
											<input id="rcStartDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "20px", width: "100px", fontSize: "10px" }} name="rcStartDate" onChange={(e) => setRcStartDate(e.target.value)} defaultValue={rcStartDate} className="form-control" />
											<input id="rcEndDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "20px", width: "100px", fontSize: "10px" }} name="rcEndDate" onChange={(e) => setRcEndDate(e.target.value)} defaultValue={rcEndDate} className="form-control" />
											<button className="btn" onClick={() => { reportsPerCategoryReset(); document.getElementById("rcStartDate").value = ""; document.getElementById("rcEndDate").value = "" }}
												style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", width: "35px", fontSize: "10px", padding: "0px" }}>Reset
											</button>
											&nbsp;
											<button className="btn" onClick={reportsPerCategorySubmitDate}
												style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", width: "35px", fontSize: "10px", padding: "0px" }}>Apply
											</button>
										</div>

										<div style={{ height: "30vh" }}>
											<Bar style={{ height: "100%" }}
												options={{
													// indexAxis: 'y',
													responsive: true,
													plugins: {
														legend: {
															display: false,
														},
														title: {
															display: true,
															text: 'Reports Per Category',
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
													},
													maintainAspectRatio: false
												}}
												data={reportsPerCategoryData}
											/>
										</div>
									</div>
								</div>
								<hr style={{ height: "0px", padding: "0", margin: "0", position: "relative", bottom: "8px" }} />
								<div className='row' style={{ width: "100%", margin: "auto" }}>
									<div style={{ height: "35vh" }} className="col-xl-12">
										<div>
											<input id="dcStartDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "20px", width: "100px", fontSize: "10px" }} name="dcStartDate" onChange={(e) => setDcStartDate(e.target.value)} defaultValue={dcStartDate} className="form-control" />
											<input id="dcEndDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "20px", width: "100px", fontSize: "10px" }} name="dcEndDate" onChange={(e) => setDcEndDate(e.target.value)} defaultValue={dcEndDate} className="form-control" />
											<button className="btn" onClick={() => { donationsPerCategoryReset(); document.getElementById("dcStartDate").value = ""; document.getElementById("dcEndDate").value = "" }}
												style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", width: "35px", fontSize: "10px", padding: "0px" }}>Reset
											</button>
											&nbsp;
											<button className="btn" onClick={donationsPerCategorySubmitDate}
												style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", width: "35px", fontSize: "10px", padding: "0px" }}>Apply
											</button>
										</div>
										<div style={{ height: "30vh" }}>
											<Bar style={{ height: "100%" }}
												options={{
													// indexAxis: 'y',
													responsive: true,
													plugins: {
														legend: {
															display: false,
														},
														title: {
															display: true,
															text: 'Donations Per Category',
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
													},
													maintainAspectRatio: false
												}}
												data={donationsPerCategoryData}
											/>
										</div>
									</div>
								</div>
							</div>

						</div>


						<div className="row" style={{ marginTop: "5px", boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)", paddingTop: "6px", paddingBottom: "6px", backgroundColor: "white" }}>
							<div style={{ height: "35vh" }} className="col-xl-4">
								<div>
									<div className='row'>
										<input id="cptStartDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "20px", width: "100px", fontSize: "10px" }} name="cptStartDate" onChange={(e) => setCptStartDate(e.target.value)} defaultValue={cptStartDate} className="form-control" />
										<input id="cptEndDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "20px", width: "100px", fontSize: "10px" }} name="cptEndDate" onChange={(e) => setCptEndDate(e.target.value)} defaultValue={cptEndDate} className="form-control" />
										<select value={clusterWastePerTruck} onChange={(e) => { setClusterWastePerTruck(e.target.value) }} style={{ marginLeft: "2px", position: "relative", padding: "0px", height: "20px", width: "fit-content", fontSize: "10px" }} className="form-control">
											<option value="">Timeline</option>
											<option value="$barangay">Barangays</option>
											<option value="$district">District</option>
										</select>
										<button className="btn" onClick={collectionPerTruckSubmitDate}
											style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", width: "35px", fontSize: "10px", padding: "0px" }}>Apply
										</button>

										&nbsp;
										<button className="btn" onClick={() => { collectionPerTruckReset(); document.getElementById("cptStartDate").value = ""; document.getElementById("cptEndDate").value = "" }}
											style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", width: "35px", fontSize: "10px", padding: "0px" }}>Reset
										</button>
									</div>
								</div>
								<div style={{ height: "30vh" }}>
									{wasteCollectionPerTruckLoading ? <Fragment><br /><div> <img src='/images/1487.gif' style={{ display: "block", margin: "auto" }} /></div></Fragment> :
										(
											applyClusterWastePerTruck === "Timeline" ?
												<Line style={{ height: "100%" }}
													options={{
														responsive: true,
														plugins: {
															legend: {
																display: false,
															},
															title: {
																display: true,
																text: 'Collected Waste Per Truck Chart',
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
														},
														maintainAspectRatio: false
													}}
													data={wasteCollectionPerTruckData}
												/> :
												<Bar style={{ height: "100%" }}
													options={{
														responsive: true,
														plugins: {
															legend: {
																display: false,
															},
															title: {
																display: true,
																text: 'Collected Waste Per Truck Chart',
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
														},
														maintainAspectRatio: false
													}}
													data={wasteCollectionPerTruckData}
												/>
										)
									}
								</div>
							</div>
							<div style={{ height: "35vh", borderRight: "1px solid #e6e6e6" }} className="col-xl-4">

								<div>
									<div className='row'>
										<input id="cpStartDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "20px", width: "100px", fontSize: "10px" }} name="cpStartDate" onChange={(e) => setCpStartDate(e.target.value)} defaultValue={cpStartDate} className="form-control" />
										<input id="cpEndDate" type="date" style={{ float: "left", marginLeft: "3px", position: "relative", height: "20px", width: "100px", fontSize: "10px" }} name="cpEndDate" onChange={(e) => setCpEndDate(e.target.value)} defaultValue={cpEndDate} className="form-control" />
										<select value={clusterCollectionPoint} onChange={(e) => { setClusterCollectionPoint(e.target.value) }} style={{ marginLeft: "2px", position: "relative", padding: "0px", height: "20px", width: "fit-content", fontSize: "10px" }} className="form-control">
											<option value="">Timeline</option>
											<option value="$barangay">Barangays</option>
											<option value="$district">District</option>
										</select>
										<button className="btn" onClick={collectionPointSubmitDate}
											style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", width: "35px", fontSize: "10px", padding: "0px" }}>Apply
										</button>
										&nbsp;
										<button className="btn" onClick={() => { collectionPointReset(); document.getElementById("cpStartDate").value = ""; document.getElementById("cpEndDate").value = "" }}
											style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", width: "35px", fontSize: "10px", padding: "0px" }}>Reset
										</button>
									</div>
								</div>
								<div style={{ height: "30vh" }}>
									{collectionPointLoading ? <Fragment><br /><div> <img src='/images/1487.gif' style={{ display: "block", margin: "auto" }} /></div></Fragment> :
										(
											applyClusterCollectionPoint === "Timeline" ?
												<Line style={{ height: "100%" }}
													options={{
														responsive: true,
														plugins: {
															legend: {
																display: false,
															},
															title: {
																display: true,
																text: 'Number Of Collection Point',
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
														},
														maintainAspectRatio: false
													}}
													data={collectionPointData}
												/> :
												<Bar style={{ height: "100%" }}
													options={{
														responsive: true,
														plugins: {
															legend: {
																display: false,
															},
															title: {
																display: true,
																text: 'Number Of Collection Point',
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
														},
														maintainAspectRatio: false
													}}
													data={collectionPointData}
												/>
										)
									}
								</div>
							</div>

							<div style={{ height: "35vh" }} className="col-xl-4">
								<div>
									<select style={{ float: "left", marginLeft: "3px", position: "relative", height: "30px", width: "100px", fontSize: "10px" }} onChange={(e) => setBarangay(e.target.value)} defaultValue={barangay} className="form-control">
										<option value="All">All Brgy.</option>
										<option value="Bagumbayan">Bagumbayan</option>
										<option value="Bambang">Bambang</option>
										<option value="Calzada">Calzada</option>
										<option value="Hagonoy">Hagonoy</option>
										<option value="Ibayo-Tipas">Ibayo-Tipas</option>
										<option value="Ligid-Tipas">Ligid-Tipas</option>
										<option value="Lower Bicutan">Lower Bicutan</option>
										<option value="New Lower Bicutan">New Lower Bicutan</option>
										<option value="Napindan">Napindan</option>
										<option value="Palingon">Palingon</option>
										<option value="San Miguel">San Miguel</option>
										<option value="Santa Ana">Santa Ana</option>
										<option value="Tuktukan">Tuktukan</option>
										<option value="Ususan">Ususan</option>
										<option value="Wawa">Wawa</option>
										<option value="Central Bicutan">Central Bicutan</option>
										<option value="Central Signal Village">Central Signal Village</option>
										<option value="Fort Bonifacio">Fort Bonifacio</option>
										<option value="Katuparan">Katuparan</option>
										<option value="Maharlika Village">Maharlika Village</option>
										<option value="North Daang Hari">North Daang Hari</option>
										<option value="North Signal Village">North Signal Village</option>
										<option value="Pinagsama">Pinagsama</option>
										<option value="South Daang Hari">South Daang Hari</option>
										<option value="South Signal Village">South Signal Village</option>
										<option value="Tanyag">Tanyag</option>
										<option value="Upper Bicutan">Upper Bicutan</option>
										<option value="Western Bicutan">Western Bicutan</option>
									</select>

									<button className="btn" onClick={topUserForAdminDate}
										style={{ float: "right", marginLeft: "3px", backgroundColor: "#33cabb", color: "white", position: "relative", width: "35px", fontSize: "10px", padding: "0px" }}>Apply
									</button>
								</div>
								<div style={{ height: "30vh" }}>
									<Bar style={{ height: "100%" }}
										options={{
											// indexAxis: 'y',
											responsive: true,
											plugins: {
												legend: {
													display: false,
												},
												title: {
													display: true,
													text: 'Top 10 Users',
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
											},
											maintainAspectRatio: false
										}}
										data={topUserForAdminData}
									/>
								</div>
							</div>

						</div>

					</div>

					<br />
					<br />
					<br />

				</div>
			</div>
		</Fragment>
	)
}

export default Dashboard