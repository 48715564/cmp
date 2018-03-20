import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/login/login.vue';
import Dashboard from '@/components/dashboard/dashboard.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requireAuth: true },
    },
    {
      path: '*',
      redirect: '/dashboard',
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('token');
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (token) {
      next();
    } else {
      next({
        path: '/login',
        // query: { redirect: to.fullPath },  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    if (to.path === '/login'&&token) next('/dashboard');
    else next();
  }
});

export default router;
