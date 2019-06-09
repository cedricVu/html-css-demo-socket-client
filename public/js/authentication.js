const HOST = 'http://localhost:3001';

$('#btn-login').click(function() {
	login($('#input-username').val(), $('#input-password').val())
});

async function login(username, password) {
	try {
		const loginResponse = await axios({
			method: 'post',
			url: `${HOST}/api/v1/login`,
			data: {
				username,
				password
			}
		});
		alert('Login successfully');
	} catch (e) {
		alert(e.response.data.message);
	}
	
}