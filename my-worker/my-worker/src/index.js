addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
	if (request.method === 'POST') {
	  try {
		// Ambil data dari form
		const formData = await request.json();
  
		const { username, email, phone, bank, account_name, account_number, game } = formData;
		const message = `
		New Registration:
		Username: ${username}
		Email: ${email}
		Phone: ${phone}
		Bank/E-wallet: ${bank}
		Account Name: ${account_name}
		Account Number: ${account_number}
		Game: ${game}`;
  
		// Ambil token dan chat ID dari environment variables
		const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
		const CHAT_ID = TELEGRAM_CHAT_ID;
  
		const telegramResponse = await fetch(TELEGRAM_API_URL, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
			chat_id: CHAT_ID,
			text: message
		  })
		});
  
		const data = await telegramResponse.json();
  
		if (data.ok) {
		  return new Response(JSON.stringify({ message: 'Registration successful!' }), { status: 200 });
		} else {
		  return new Response(JSON.stringify({ message: 'Failed to send message to Telegram.' }), { status: 500 });
		}
	  } catch (error) {
		return new Response('Error processing your request', { status: 500 });
	  }
	} else {
	  return new Response('Method not allowed', { status: 405 });
	}
  }
  