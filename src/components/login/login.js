import AuthService from '@/services/AuthService';
import $ from 'jquery';
import axios from "axios";

export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      isCircle: true,
    }
  },
  methods: {
    login() {
      const name = this.username;
      const pwd = this.password;
      if (!name) {
        $('#user').find('input').focus();
        return;
      } else if (!pwd) {
        $('#pwd').find('input').focus();
        return;
      };

      const result = AuthService.login(name, pwd)
        .then((res) => {
          if (res.data.success) {
            localStorage.token = res.data.result.token;
            this.$Notify.success({
              title: 'ok',
              message: '登陆成功',
            });
            this.$router.push('/dashboard');
          } else {
            this.$Notify.error({
              title: 'error',
              message: res.data.msg,
            });
            this.password = '';
          }
        }).catch((res)=> {

        });

    },
  },
  created() {
  },
};
