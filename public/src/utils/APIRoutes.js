export const host = process.env.REACT_APP_SERVER_API_URL;

//user
export const registerRoute = `${host}/api/user/register`;
export const loginRoute = `${host}/api/user/login`;
export const setAvatarRoute = `${host}/api/user/setAvatar`;
export const getUserContactsRoute = `${host}/api/user/userContacts`;
export const getUsersRoute = `${host}/api/user/users`;

//messages
export const sendMessageRoute = `${host}/api/messages/addMessage`;
export const getAllMessagesRoute = `${host}/api/messages/getMessages`;

//friendRequests
export const createRequestRoute = `${host}/api/friendRequests/create`;
export const getRequestsBySenderRoute = `${host}/api/friendRequests/bySender`;
export const getRequestsByReciverRoute = `${host}/api/friendRequests/byReciver`;
export const declineRequestRoute = `${host}/api/friendRequests/decline`;
export const acceptRequestRoute = `${host}/api/friendRequests/accept`;
