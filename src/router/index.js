import { createRouter, createWebHistory } from 'vue-router';

// import CoachDetail from '@/pages/coaches/CoachDetail.vue';
// import CoachesList from './pages/coaches/CoachesList.vue';
// import CoachRegistation from '@/pages/coaches/CoachRegistration.vue';
// import ContactCoach from '@/pages/requests/ContactCoach.vue';
// import RequestsReceived from './pages/requests/RequestsReceived.vue';
// import NotFound from '@/pages/NotFound.vue';
import store from '@/store'

const router = createRouter({
	history: createWebHistory(),
	routes: [{
			path: '/',
			redirect: '/coaches'
		},
		// { path: '/coaches', component: CoachesList },
		{
			path: '/coaches',
			component: () => import( /* webpackChunkName: "coachesList" */ '@/pages/coaches/CoachesList.vue'),
		},
		{
			path: '/coaches/:id',
			// component: CoachDetail,
			component: () => import( /* webpackChunkName: "CoachDetail" */ '@/pages/coaches/CoachDetail.vue'),
			props: true,
			children: [{
				path: 'contact',
				// props: true,
				// component: ContactCoach
				component: () => import( /* webpackChunkName: "CoachDetail" */ '@/pages/requests/ContactCoach.vue'),
				} // /coaches/c1/contact
			]
		},
		{
			path: '/register',
			// component: CoachRegistation,
      component: () => import(/* webpackChunkName: "CoachRegistation" */ '@/pages/coaches/CoachRegistration.vue'),
			meta: {requiresAuth: true},
		},
		{
			path: '/requests',
			// component: RequestsReceived
      component: () => import(/* webpackChunkName: "RequestsReceived" */ '@/pages/requests/RequestsReceived.vue'),
			meta: {requiresAuth: true},
		},
		{
			path: '/auth',
			// component: UserAuth
      component: () => import(/* webpackChunkName: "UserAuth" */ '@/pages/auth/UserAuth.vue'),
			meta: {requiresUnAuth: true},
		},

		{
			path: '/:notFound(.*)',
			// component: NotFound,
      component: () => import(/* webpackChunkName: "NotFound" */ '@/pages/NotFound.vue'),
		}
	]
});

router.beforeEach(function(to, _, next) {
	if(to.meta.requiresAuth && !store.getters.isAuthenticated) {
		next('/auth')
	} else if(to.meta.requiresUnAuth && store.getters.isAuthenticated) {
		next('/coaches')
	} else {
		next()
	}
})

export default router;