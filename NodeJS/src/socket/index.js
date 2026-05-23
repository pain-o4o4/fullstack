// ================================================================
// Socket Module — Entry Point
// ================================================================
// File này là "cổng vào" duy nhất cho toàn bộ module socket.
// Các file khác trong project chỉ cần import từ đây:
//   import initSocket, { getIO } from './socket';
//   import { getIO } from '../socket';
// ================================================================

import { initSocket, getIO } from './init';

export { initSocket, getIO };
export default initSocket;
