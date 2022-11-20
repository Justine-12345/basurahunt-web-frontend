import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
    authReducer, 
    allUsersReducer, 
    findEmailReducer,
    userReducer,
    forgotPasswordReducer,
    userDetailsReducer,
    userReportsAndItemsReducer,
    notificationReducer,
    levelExpReducer } from './reducers/userReducers'

import { 
    dumpsReducer,
    newDumpReducer,
    allDumpsReducer,
    dumpDetailsReducer,
    dumpReducer,
    rankingReducer,
    dumpCommentReducer
} from './reducers/dumpReducers'

import {
    collectionPointsReducer,
    collectorsReducer,
    collectionPointReducer,
    collectionPointDetailsReducer,
    newCollectionPointReducer,
    liveNotificationReducer,
} from './reducers/collectionPointReducers';

import {
    itemsReducer,
    itemReducer,
    itemDetailsReducer,
    newItemReducer,
} from './reducers/itemReducers';

import {
    newsfeedsReducer,
    newsfeedReducer,
    newsfeedDetailsReducer,
    newNewsfeedReducer,
} from './reducers/newsfeedReducers';

import {
    newChatReducer,
    chatDetailsReducer,
    chatReducer
} from './reducers/chatReducers';

import {
    usersTotalReducer,
    dumpsTotalReducer,
    donationsTotalReducer,
    donatedItemsReducer,
    cleanedDumpsReducer,
    uncleanedDumpsReducer,
    wasteCollectionPerTruckReducer,
    collectionPointDashReducer,
    reportsPerCategoryReducer,
    donationsPerCategoryReducer
} from './reducers/dashboardReducers';

import {
    newFeedbackReducer,
    feedbackDetailsReducer,
    allFeedBacksReducer
} from './reducers/feedbackReducers';

import { 
    coordinateReducer 
} from './reducers/mapReducers';

const reducer = combineReducers({
    auth: authReducer,
    allUsers: allUsersReducer,
    findEmail: findEmailReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    userDetails: userDetailsReducer,
    userReportsAndItems: userReportsAndItemsReducer,
    notification:notificationReducer,
    levelExp:levelExpReducer,

    dumps: dumpsReducer,
    newDump: newDumpReducer,
    allDumps: allDumpsReducer,
    dumpDetails: dumpDetailsReducer,
    dump: dumpReducer,
    ranking: rankingReducer,
    dumpComment:dumpCommentReducer,
    
    collectionPoints: collectionPointsReducer,
    collectors: collectorsReducer,
    collectionPoint: collectionPointReducer,
    collectionPointDetails: collectionPointDetailsReducer,
    newCollectionPoint: newCollectionPointReducer,
    liveNotification:liveNotificationReducer,

    items: itemsReducer,
    item: itemReducer,
    itemDetails: itemDetailsReducer,
    newItem: newItemReducer,

    newsfeeds: newsfeedsReducer,
    newsfeed: newsfeedReducer,
    newsfeedDetails: newsfeedDetailsReducer,
    newNewsfeed: newNewsfeedReducer,

    newChat: newChatReducer,
    chatDetails: chatDetailsReducer,
    chat: chatReducer,

    usersTotal: usersTotalReducer,
    dumpsTotal: dumpsTotalReducer,
    donationsTotal: donationsTotalReducer,
    donatedItems: donatedItemsReducer,
    cleanedDumps: cleanedDumpsReducer,
    uncleanedDumps: uncleanedDumpsReducer,
    wasteCollectionPerTruck:wasteCollectionPerTruckReducer,
    collectionPointDash: collectionPointDashReducer,
    reportsPerCategory:reportsPerCategoryReducer,
    donationsPerCategory:donationsPerCategoryReducer,

    newFeedback: newFeedbackReducer,
    feedbackDetails: feedbackDetailsReducer,
    allFeedBacks: allFeedBacksReducer,

    coordinate:coordinateReducer
})

let initialState = {
}

const middlware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))

export default store;