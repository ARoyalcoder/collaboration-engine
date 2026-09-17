export type SocketUser = {
  id: string;
  name: string;
  email: string;
};


export type AuthenticatedSocketData = {
  user: SocketUser;
};