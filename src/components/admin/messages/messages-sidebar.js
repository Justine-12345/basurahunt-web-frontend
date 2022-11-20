import React, {Fragment, useState} from 'react';
import {Link, useLocation } from 'react-router-dom';

const MessagesSidebar = () => {

	let location = useLocation();
	let path = location.pathname

	return(
		<Fragment>
			<div className="user-select-none msg-sidebar">
				<p className="text-center msg-header">Messages</p>
				<div className="msg-items">
					{/*----------------------*/}
					<div className="msg-item">
						<div className="msg-item-content">
							<div className="msg-item-img" style={{backgroundImage: 'url("https://images.pexels.com/photos/12640456/pexels-photo-12640456.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load")'}}/>
							<div className="msg-info">
								<p className="msg-item-name">Lorem Ipsum</p>
								<p className="msg-item-shortmsg">Latest message blah blah blah blah blah</p>
							</div>
						</div>
					</div>
					
				</div>
			</div>
		</Fragment>
		)
}

export default MessagesSidebar