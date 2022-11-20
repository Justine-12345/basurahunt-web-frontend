import { SOCKET_PORT } from './constants/socketConstants'
import io from "socket.io-client";
const socket = io.connect(SOCKET_PORT);

const NotificationSender = (title, sender = null, receiver = null, barangay, category = null, notifCode = null, model = null,) => {
   let categoryLink

   if (category === "schedule") {
      categoryLink = `/schedule/notification/${title}/${notifCode}`
   }
   if (category === "live") {
      categoryLink = `/schedule/view/${model._id}/${model.roomCode}`
   }

   if (category === "illegalDump-new") {
      categoryLink = `/report/${model._id}/${model.coordinates.longtitude}/${model.coordinates.latitude}`
   }
   if (category === "illegalDump-update") {
      categoryLink = `/report/${model._id}/${model.coordinates.longtitude}/${model.coordinates.latitude}`
   }

   if (category === "illegalDump-update-status") {
      categoryLink = `/report/${model._id}/${model.coordinates.longtitude}/${model.coordinates.latitude}`
   }

   if (category === "illegalDump-new-message") {
      categoryLink = `/report/${model._id}/${model.coordinates.longtitude}/${model.coordinates.latitude}/true`
   }

   if (category === "illegalDump-new-comment") {
      categoryLink = `/report/${model._id}/${model.coordinates.longtitude}/${model.coordinates.latitude}/`
   }

   if (category === "donation-new") {
      categoryLink = `/donation/${model._id}/`
   }

   if (category === "donation-update-claim") {
      categoryLink = `/donation/${model._id}/`
   }

   if (category === "donation-update-cancel") {
      categoryLink = `/donation/${model._id}/`
   }

   if (category === "donation-update-confirm") {
      categoryLink = `/donation/${model._id}/`
   }

   if (category === "donation-update-receive") {
      categoryLink = `/donation/${model._id}/`
   }

   if (category === "donation-new-message") {
      categoryLink = `/donation/${model._id}/true`
   }

   if (category === "collection-mass-add") {
      categoryLink = `/admin/schedule/${model._id}/`
   }

   if (category === "newsfeeds-add") {
      categoryLink = `/post/${model._id}/`
   }

   if (category === "feedback-new") {
      categoryLink = `/feedback/`
   }

   if (category === "user-verified") {
      categoryLink = `/${model.user_id.alias}`
   }


   socket.emit("join_room", 'basurahunt-notification-3DEA5E28CE9B6E926F52AF75AC5F7-94687284AF4DF8664C573E773CF31')

   const messageData = {
      room: 'basurahunt-notification-3DEA5E28CE9B6E926F52AF75AC5F7-94687284AF4DF8664C573E773CF31',
      title: title,
      sender: sender,
      receiver: receiver,
      barangay: barangay,
      time: new Date(Date.now()),
      link: categoryLink,
      status: "unread",
      notifCode: notifCode,
      category: category,
   }


   socket.emit("send_message", messageData);

}


export default NotificationSender