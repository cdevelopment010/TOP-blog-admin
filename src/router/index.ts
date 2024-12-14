import { createRouter, createWebHistory } from 'vue-router'; 
import { isAuthenticated } from '../utils/auth';
import HomeView from '../views/HomeView.vue'; 
import SignIn from '../views/SignIn.vue';
import SignUp from '../views/SignUp.vue';
import TagList from '../views/TagList.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), 
    routes: [
        {path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true }}, 
        {path: '/sign-in', name: 'sign-in', component: SignIn}, 
        {path: '/sign-up', name: 'sign-up', component: SignUp}, 
        {path: '/posts', name: 'posts', component: HomeView, meta: { requiresAuth: true }}, 
        {path: '/tags', name: 'tags', component: TagList, meta: { requiresAuth: true }}, 
        {path: '/posts/new-post', name: 'new-post', component: HomeView, meta: { requiresAuth: true }}, 
        //{path: '/about', name: 'about', component: () => import('../views/AboutView.vue'), meta: { requiresAuth: true }} //Lazy-loaded (route level code-splitting)
    ]
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated() ) {
        console.log("HERE", from);
        //redirect to sign-in if not authenticated
        next({ name: 'sign-in'}); 
    } else {
        next(); 
    }
})

export default router; 