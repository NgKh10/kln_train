const { testConnection } = require('./config/db');

async function run() {
  const connected = await testConnection();
  if (connected) {
    console.log('🎉 Kết nối thành công!');
  } else {
    console.log('💥 Kết nối thất bại!');
  }
}

run();