import FileTransferRoutes from './fileTransfer';
import SessionRoutes from './session';
import userRoutes from './user';
export const Routes_v1 = [...FileTransferRoutes, ...SessionRoutes, ...userRoutes];
