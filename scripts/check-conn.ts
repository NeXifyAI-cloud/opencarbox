import net from 'net';

const host = 'db.cwebcfgdraghzeqgfsty.supabase.co';
const ports = [5432, 6543];

ports.forEach(port => {
  const socket = new net.Socket();
  socket.setTimeout(2000);
  socket.on('connect', () => {
    console.log(`✅ Connected to ${host}:${port}`);
    socket.destroy();
  });
  socket.on('timeout', () => {
    console.log(`❌ Timeout on ${host}:${port}`);
    socket.destroy();
  });
  socket.on('error', (err) => {
    console.log(`❌ Error on ${host}:${port}: ${err.message}`);
    socket.destroy();
  });
  socket.connect(port, host);
});
