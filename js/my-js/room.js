const token = localStorage.getItem('token');
if (!token) {
	window.location.href='login.html';
} 
const socket = io('http://localhost:3030?token=' + token);

const urlString = window.location.href;
const url = new URL(urlString);
const roomName = url.searchParams.get('room');
$('#roomName').append(roomName);


socket.on('rooms', function (responseData) {
	switch(responseData.action) {
		case 'userDisconnect':
			if (responseData.data.members && responseData.data.members.length === 0) {
				localStorage.removeItem('token');
				window.location.href = 'login.html';
			}
			appendUsernameToChat(responseData.data.members);
			break;
		case 'join':
			appendUsernameToChat(responseData.data.members);
			break;
	}
});

socket.on('messages', function (responseData) {
	switch (responseData.action) {
		case 'create':
			appendMessageToBox(responseData, true);
			break;
	}
});

socket.emit('rooms', {
	action: 'join',
	data: {
		roomName
	}
}, function(error, responseData) {
	if (error) {
		console.log(error);
	} else {
		console.log(responseData);
		appendUsernameToChat(responseData);
	}
});


$('#btn-sign-out').click(function () {
	localStorage.removeItem('token');
	window.location.href='login.html';

});

function appendUsernameToChat(usernameArray) {
	$('#list-user').empty();
	for (const username of usernameArray) {
		$('#list-user').append(`
			<li class="clearfix">
	          <div class="about">
	            <div class="name">${username}</div>
	            <div class="status">
	              <i class="fa fa-circle online"></i> online
	            </div>
	          </div>
	        </li>
		`);
	}
}

////// Send message feature ////
$('#btn-send').click(function (event) {
	const message = $('textarea#txt-message').val();
	// roomName
	const type = 'text';
	socket.emit('messages', {
		action: 'create',
		data: {
			type,
			body: message,
			roomName
		}
	}, function (error, responseData) {
		if (error) {
			return alert('Having error while sending!');
		}
		console.log(responseData);
		/// Display the sent message into the box.
		appendMessageToBox(responseData, false);
	});
});

function appendMessageToBox (responseData, isOtherMessage) {
	if (responseData.data.senderName === localStorage.getItem('username')) {
		// my message
	} else {
		// the other message
	}
// Append message to box
	// let wrapMessageClassName = 'message-data align-right';
	// let messageClassName = 'message other-message float-right';
 //    if (!isOtherMessage) {
 //    	wrapMessageClassName = 'message-data';
 //    	messageClassName = 'message my-message float-right';
 //    }
 //    const messageTemplate = `
	// 	<li class="clearfix">
	//         <div class="${wrapMessageClassName}">
	//           <span class="message-data-time" >10:10 AM, Today</span> &nbsp; &nbsp;
	//           <span class="message-data-name" >${responseData.data.senderName}</span> <i class="fa fa-circle me"></i>
	          
	//         </div>
	//         <div class="${messageClassName}">
	//           ${responseData.data.body}
	//         </div>
 //      	</li>
 //    `;
	// return $('.chat-history ul').append(messageTemplate);

}