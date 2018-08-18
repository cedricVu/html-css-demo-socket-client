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
			appendUsernameToChat(responseData.data.members);
			break;
		case 'join':
			appendUsernameToChat(responseData.data.members);
			break;
	}
});

socket.on('messages', function (responseData) {
	switch (responseData.action) {
		case 'receive':
			alert('New message')
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


$('#btn-send').click(function() {
	const message = $('textarea#message-to-send').val();
	socket.emit('messages', {
		action: 'send',
		data: message
	});
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