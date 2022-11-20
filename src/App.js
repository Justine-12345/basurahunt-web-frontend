import './App.css';
import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Index from './components/index';
import Header from './components/layouts/header';
import GuestHeader from './components/layouts/guest-header';
import Footer from './components/layouts/footer';
import AccessDenied from './components/extras/access-denied';
import UserBanned from './components/extras/user-banned';
import Notifications from './components/extras/notifications';
import ScheduleNotificationView from './components/extras/schedule-notification-view';

import Login from './components/user/login';
import Register from './components/user/register';
import RegisterOTP from './components/user/register-otp';

import AdminProfile from './components/admin/admin-profile';

import Profile from './components/user/profile.js';
import ProfileUpdate from './components/user/profileUpdate.js';
import PasswordUpdate from './components/user/passwordUpdate.js';

import ForgotPassword from './components/user/forgot-password';
import ResetPassword from './components/user/reset-password'

import About from './components/home/about';
import Dashboard from './components/admin/dashboard';

import UsersList from './components/admin/users/users-list';
import UsersView from './components/admin/users/users-view';
import UsersUpdate from './components/admin/users/users-update';

import ReportsList from './components/admin/reports/reports-list';
import ReportsView from './components/admin/reports/reports-view';
import ReportsAdd from './components/admin/reports/reports-add';
import ReportsUpdate from './components/admin/reports/reports-update';
import ReportsConfirm from './components/admin/reports/report-confirm';

import DonationsList from './components/admin/donations/donations-list';
import DonationsView from './components/admin/donations/donations-view';
import DonationsAdd from './components/admin/donations/donations-add';
import DonationsUpdate from './components/admin/donations/donations-update';

import SchedulesList from './components/admin/schedules/schedules-list';
import SchedulesView from './components/admin/schedules/schedules-view';
import SchedulesAdd from './components/admin/schedules/schedules-add';
import SchedulesUpdate from './components/admin/schedules/schedules-update';

import NewsfeedsList from './components/home/newsfeed/newsfeeds-list';
import NewsfeedsView from './components/home/newsfeed/newsfeeds-view';
import NewsfeedsAdd from './components/admin/newsfeeds/newsfeeds-add';
import NewsfeedsUpdate from './components/admin/newsfeeds/newsfeeds-update';

import Ranking from './components//home/ranking/ranking';

import PublicReportsList from './components//home/reports/public-reports-list';
import PublicReportsView from './components//home/reports/public-reports-view';
import PublicReportsAdd from './components//home/reports/public-reports-add';

import PublicDonationsList from './components/donation/public-donations-list';
import PublicDonationsView from './components/donation/public-donations-view';
import PublicDonationsAdd from './components/donation/public-donations-add';

import UserDonationsList from './components/user/records/user-donations-list.js';
import UserReceivedDonationsList from './components/user/records/user-received-donations-list';
import UserClaimedDonationsList from './components/user/records/user-claimed-donations-list';
import UserReportsList from './components/user/records/user-reports-list';

import ScheduleToday from './components/schedule/schedule-today';
import ScheduleView from './components/schedule/schedule-view';
import ScheduleUpcoming from './components/schedule/schedule-upcoming';


import CollectorProfile from './components/collector/collector-profile';
import CollectorScheduleToday from './components/collector/collector-schedule-today';
import CollectorScheduleUpcoming from './components/collector/collector-schedule-upcoming';
import CollectorScheduleView from './components/collector/collector-schedule-view';
import CollectorAssignment from './components/collector/collector-assignment';
import CollectorFinished from './components/collector/collector-finished';

import BarangayProfile from './components/barangay/barangay-profile';
import BarangayDashboard from './components/barangay/barangay-dashboard';
import BarangayReportsList from './components/barangay/barangay-reports-list';
import BarangayScheduleToday from './components/barangay/barangay-schedule-today';
import BarangayScheduleUpcoming from './components/barangay/barangay-schedule-upcoming';
import Feedback from './components/extras/feedback';

import AdminMessages from './components/admin/messages/messages-content';
import ProtectedRoute from './components/route/ProtectedRoute'

import HowToReport from './components/extras/info/how-to-report';
import HowToDonate from './components/extras/info/how-to-donate';
import WhenAndWhere from './components/extras/info/when-and-where';
import { useSelector } from 'react-redux'
import Table from './components/admin/Table';
import Imap from './Imap';
function App() {

  const [auth, setAuth] = useState('')
  const {isAuthenticated} = useSelector(state => state.auth)

  useEffect(()=>{
    setAuth(localStorage.getItem("isAuthenticated"))

  },[auth, isAuthenticated])

  return (
    <Router basename="/basurahunt-web-frontend">
      <div className="App">
      {!auth?
        <GuestHeader/>:<Header/>
      }
        
          <Routes>
            {/*AUTH===JUSTINE*/}
            <Route path="/table" element={<Table/>} exact="true"/>
            <Route path="/map" element={<Imap/>} exact="true"/>
            <Route path="/" element={<Index/>} exact="true"/>
            <Route path="/about" element={<About/>} exact="true"/>
            <Route path="/login" element={<Login/>} exact="true"/>
            <Route path="/register" element={<Register/>} exact="true"/>
            <Route path="/register/email-verification" element={<RegisterOTP/>} exact="true"/>
            
            {/*continue===JUSTINE*/}
            <Route path="/forgot-password" element={<ForgotPassword/>} exact="true"/>
            <Route path="/reset-password/:token/:email" element={<ResetPassword/>} exact="true"/>


            {/*ADMIN===*/}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard/>
              </ProtectedRoute>
            } exact="true"/>

            <Route path="/admin/profile" element={
              <ProtectedRoute isAdmin={true}>
                <AdminProfile/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/admin/profile/update" element={
              <ProtectedRoute isAdmin={true}>
                <ProfileUpdate/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/admin/password/update" element={
              <ProtectedRoute isAdmin={true}>
                <PasswordUpdate/>
              </ProtectedRoute>} exact="true"/>


            {/*USERS===JUSTINE*/}
            <Route path="/admin/users" element={
              <ProtectedRoute isAdmin={true}>
                <UsersList/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/admin/user/:id" element={
              <ProtectedRoute isAdmin={true}>
                <UsersView/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/admin/user/:id/edit" element={
              <ProtectedRoute isAdmin={true}>
                <UsersUpdate/>
              </ProtectedRoute>} exact="true"/>


            {/*REPORTED ILLEGAL DUMP===JUSTINE*/}
            <Route path="/admin/reports" element={
              <ProtectedRoute isAdmin={true}>
                <ReportsList/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/admin/report/:id/:long/:lati/" element={
              <ProtectedRoute isAdmin={true}>
               <ReportsView/>
              </ProtectedRoute>} exact="true"/>


            <Route path="/admin/report/:id/:long/:lati/:view" element={
              <ProtectedRoute isAdmin={true}>
                <ReportsView/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/admin/report/:id/:long/:lati/edit" element={
              <ProtectedRoute isAdmin={true}>
                <ReportsUpdate/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/admin/report/:id/:long/:lati/confirm" element={
              <ProtectedRoute isAdmin={true}>
                <ReportsConfirm/>
            </ProtectedRoute>} exact="true"/>
              


            <Route path="/admin/report/new" element={
              <ProtectedRoute isAdmin={true}>
                <ReportsAdd/>
              </ProtectedRoute>} exact="true"/>
        
            {/*DONATED ITEMS===HARRIS*/}
            <Route path="/admin/donations" element={
              <ProtectedRoute isAdmin={true}>
                <DonationsList/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/admin/donation/new" element={
              <ProtectedRoute isAdmin={true}>
                <DonationsAdd/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/admin/donation/:id" element={
              <ProtectedRoute isAdmin={true}>
                <DonationsView/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/admin/donation/:id/edit" element={
              <ProtectedRoute isAdmin={true}>
                <DonationsUpdate/>
              </ProtectedRoute>} exact="true"/>

            {/*SCHEDULES===HARRIS*/}
            <Route path="/admin/schedules" element={
              <ProtectedRoute isAdmin={true}>
                <SchedulesList/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/admin/schedule/new" element={
              <ProtectedRoute isAdmin={true}>
                <SchedulesAdd/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/admin/schedule/:id" element={
              <ProtectedRoute isAdmin={true}>
                <SchedulesView/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/admin/schedule/:id/edit" element={
              <ProtectedRoute isAdmin={true}>
                <SchedulesUpdate/>
              </ProtectedRoute>} exact="true"/>

            {/*NEWSFEEDS===HARRIS*/}
            <Route path="/admin/newsfeeds/new" element={
              <ProtectedRoute isAdmin={true}>
                <NewsfeedsAdd/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/post/:id/edit" element={
              <ProtectedRoute isAdmin={true}>
                <NewsfeedsUpdate/>
              </ProtectedRoute>} exact="true"/>

            {/*WEEK 12 & 13 3RD SEMESTER*/}

            {/*newsfeed view for both users and admin===HARRIS*/}
            <Route path="/post/:id" element={
              <ProtectedRoute>
                <NewsfeedsView/>
              </ProtectedRoute>} exact="true"/>


            <Route path="/newsfeed" element={
              <ProtectedRoute>
                <NewsfeedsList/>
              </ProtectedRoute>
            } exact="true"/>
            

            {/*ranking===JUSTINE*/}
            <Route path="/ranking" element={
              <ProtectedRoute isUser={true} NotForNewUser={true}>
                <Ranking/>
              </ProtectedRoute>} exact="true"/>
            
            {/*reported illegal dumps for public view===JUSTINE*/}
            <Route path="/reports" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
                <PublicReportsList/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/reports/search/:keyword" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
                <PublicReportsList/>
              </ProtectedRoute>} exact="true"/> 

            <Route path="/report/new" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
                <PublicReportsAdd/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/report/:id/:long/:lati/" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
                <PublicReportsView/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/report/:id/:long/:lati/:view" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
                <PublicReportsView/>
              </ProtectedRoute>} exact="true"/>


            {/*donations for public view===HARRIS*/}
            <Route path="/donations" element={
              <ProtectedRoute isUser={true} NotForNewUser={true}>
                <PublicDonationsList/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/donations/search/:keyword" element={
              <ProtectedRoute isUser={true} NotForNewUser={true}>
                <PublicDonationsList/>
              </ProtectedRoute>} exact="true"/> 

            <Route path="/donation/new" element={
              <ProtectedRoute isUser={true} NotForNewUser={true}>
                <PublicDonationsAdd/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/donation/:id" element={
              <ProtectedRoute isUser={true} NotForNewUser={true}>
                <PublicDonationsView/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/donation/:id/:view" element={
              <ProtectedRoute isUser={true} NotForNewUser={true}>
                <PublicDonationsView/>
              </ProtectedRoute>} exact="true"/>


            {/*schedule for public view===HARRIS*/}
            <Route path="/schedule/today" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
                <ScheduleToday/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/schedule/view/:id/:roomCode" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
                <ScheduleView/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/schedule" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
                <ScheduleUpcoming/>
              </ProtectedRoute>} exact="true"/>


     
            {/*user's record===JUSTINE*/}
            <Route path="/:username" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
              <Profile/>
              </ProtectedRoute>} exact="true"/>
            <Route path="/:username/update" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
                <ProfileUpdate/>
              </ProtectedRoute>} exact="true"/>
            <Route path="/:username/update/password" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
                <PasswordUpdate/>
              </ProtectedRoute>} exact="true"/>


            <Route path="/:username/donated-items" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
                <UserDonationsList/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/:username/received-donated-items" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
              <UserReceivedDonationsList/>
            </ProtectedRoute>} exact="true"/>

            <Route path="/:username/claimed-donated-items" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
                <UserClaimedDonationsList/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/:username/reports" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
                <UserReportsList/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/schedule/notification/:title/:id" element={
              <ProtectedRoute>
                <ScheduleNotificationView/>
              </ProtectedRoute>} exact="true"/>


            {/*AUG 26, 2022*/}
            {/*collector === HARRIS*/}

            <Route path="/collector/profile/update" element={
              <ProtectedRoute isGarbageCollector={true}>
                <ProfileUpdate/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/collector/password/update" element={
              <ProtectedRoute isGarbageCollector={true}>
                <PasswordUpdate/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/collector/profile" element={
              <ProtectedRoute isGarbageCollector={true}>
                <CollectorProfile/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/collector/schedule/today" element={
              <ProtectedRoute isGarbageCollector={true}>
                <CollectorScheduleToday/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/collector/schedule" element={
              <ProtectedRoute isGarbageCollector={true}>
                <CollectorScheduleUpcoming/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/collector/schedule/view/:id/:roomCode" element={
              <ProtectedRoute isGarbageCollector={true}>
                <CollectorScheduleView/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/collector/report/:id/:long/:lati/" element={
              <ProtectedRoute isGarbageCollector={true}>
                <ReportsView/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/collector/assignments" element={
              <ProtectedRoute isGarbageCollector={true}>
                <CollectorAssignment/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/collector/assignments/finished" element={
              <ProtectedRoute isGarbageCollector={true}>
                <CollectorFinished/>
              </ProtectedRoute>} exact="true"/>
            
            {/*barangay === HARRIS */}
            <Route path="/barangay/profile/update" element={
              <ProtectedRoute isBarangayAdministrator={true}>
                <ProfileUpdate/>
              </ProtectedRoute>
            } exact="true"/>
            <Route path="/barangay/password/update" element={
              <ProtectedRoute isBarangayAdministrator={true}>
                <PasswordUpdate/>
              </ProtectedRoute>
            } exact="true"/>
            <Route path="/barangay/profile" element={
              <ProtectedRoute isBarangayAdministrator={true}>
                <BarangayProfile/>
              </ProtectedRoute>
            } exact="true"/>
            <Route path="/barangay/dashboard" element={
              <ProtectedRoute isBarangayAdministrator={true}>
                <BarangayDashboard/>
              </ProtectedRoute>
            } exact="true"/>
            <Route path="/barangay/reports" element={
              <ProtectedRoute isBarangayAdministrator={true}>
                <BarangayReportsList/>
              </ProtectedRoute>
            } exact="true"/>
            <Route path="/barangay/ranking" element={
              <ProtectedRoute isBarangayAdministrator={true}>
                <Ranking/>
              </ProtectedRoute>
            } exact="true"/>
            <Route path="/barangay/report/:id/:long/:lati/" element={
              <ProtectedRoute isBarangayAdministrator={true}>
                <ReportsView/>
              </ProtectedRoute>
            } exact="true"/>
            <Route path="/barangay/schedule/today" element={
              <ProtectedRoute isBarangayAdministrator={true}>
                <BarangayScheduleToday/>
              </ProtectedRoute>
            } exact="true"/>
            <Route path="/barangay/schedule" element={
              <ProtectedRoute isBarangayAdministrator={true}>
                <BarangayScheduleUpcoming/>
              </ProtectedRoute>
            } exact="true"/>
            <Route path="/barangay/schedule/view/:id/:roomCode" element={
              <ProtectedRoute isBarangayAdministrator={true}>
                <ScheduleView/>
              </ProtectedRoute>
            } exact="true"/>
              
            <Route path="/barangay/report/:id/:long/:lati/confirm" element={
              <ProtectedRoute isBarangayAdministrator={true}>
                <ReportsConfirm/>
            </ProtectedRoute>} exact="true"/>
            

            <Route path="/barangay/feedback" element={
              <ProtectedRoute isBarangayAdministrator={true}>
                <Feedback/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/collector/feedback" element={
              <ProtectedRoute isGarbageCollector={true}>
                <Feedback/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/admin/feedback" element={
              <ProtectedRoute isAdmin={true}>
                <Feedback/>
              </ProtectedRoute>} exact="true"/>

            <Route path="/feedback" element={
              <ProtectedRoute isUser={true} isNewUser={true}>
                <Feedback/>
              </ProtectedRoute>} exact="true"/>

            {/*access denied===JUSTINE*/}
            <Route path="/access-denied" element={<AccessDenied/>} exact="true"/>
             <Route path="/user-banned" element={<UserBanned/>} exact="true"/>


            {/*messages for admin*/}
           {/* <Route path="/admin/messages" element={<AdminMessages/>} exact="true"/>*/}

            <Route path="/how-to-report" element={<HowToReport/>} exact="true"/>
            <Route path="/how-to-donate" element={<HowToDonate/>} exact="true"/>
            <Route path="/when-and-where" element={<WhenAndWhere/>} exact="true"/>

          </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
