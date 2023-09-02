export const host = process.env.REACT_APP_SERVER_API_URL;
export const registerRoute = `${host}/api/user/register`;
export const loginRoute = `${host}/api/user/login`;
export const setAvatarRoute = `${host}/api/user/setAvatar`;
export const getUserContactsRoute = `${host}/api/user/userContacts`;
export const sendMessageRoute = `${host}/api/messages/addMessage`;
export const getAllMessagesRoute = `${host}/api/messages/getMessages`;
