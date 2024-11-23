const TELEGRAM_BOT_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_API_KEY}/sendMessage`;
const CHAT_ID = process.env.CHAT_ID;

async function sendToTelegram(data) {
  const message = `
    Pendaftaran Baru:
    \nUsername: ${data.username}
    \nEmail: ${data.email}
    \nNo. Telegram/WhatsApp: ${data.phone}
    \nBank/E-wallet: ${data.bank}
    \nNama Rekening: ${data.account_name}
    \nNomor Rekening: ${data.account_number}
    \nJenis Permainan: ${data.game}
  `;

  const response = await fetch(TELEGRAM_BOT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message
    })
  });

  if (!response.ok) {
    throw new Error('Gagal mengirim pesan ke Telegram');
  }

  return await response.json();
}

export default {
  async fetch(req, env) {
    if (req.method === 'POST') {
      try {
        const data = await req.json();
        
        // Kirim data ke Telegram
        const telegramResponse = await sendToTelegram(data);

        return new Response(JSON.stringify({ success: true, telegramResponse }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Invalid request', { status: 400 });
  }
};
