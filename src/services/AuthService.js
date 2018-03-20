import CONFIG from '@/utils/config';
import axios from 'axios';
import querystring from 'querystring';

const login = (username, password) => axios.post(CONFIG.api.userLogin, querystring.stringify({
  username:username,
  password:password,
}));
export default {
  login,
};
