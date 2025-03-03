import { createRouter, createWebHistory } from 'vue-router'; 
import { isAuthenticated } from '../utils/auth';
import HomeView from '../views/HomeView.vue'; 
import SignIn from '../views/SignIn.vue';
import SignUp from '../views/SignUp.vue';
import ResetPassword from '../views/ResetPassword.vue';
import TagList from '../views/TagList.vue';
import PostView from '../views/PostView.vue';
import CreatePostView from '../views/CreatePostView.vue';
import previewView from '../views/previewView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), 
    routes: [
        {path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true }}, 
        {path: '/sign-in', name: 'sign-in', component: SignIn}, 
        {path: '/sign-up', name: 'sign-up', component: SignUp}, 
        {path: '/reset-password', name: 'reset-password', component: ResetPassword}, 
        {path: '/posts', name: 'posts', component: PostView, meta: { requiresAuth: true }}, 
        {path: '/tags', name: 'tags', component: TagList, meta: { requiresAuth: true }}, 
        {path: '/posts/new-post', name: 'new-post', component: CreatePostView, meta: { requiresAuth: true }}, 
        {path: '/posts/update-post/:id', name: 'update-post', component: CreatePostView, meta: { requiresAuth: true }},
        {path: '/posts/preview-post/:id', name: 'preview-post', component: previewView, meta: { requiresAuth: true }}
        //{path: '/about', name: 'about', component: () => import('../views/AboutView.vue'), meta: { requiresAuth: true }} //Lazy-loaded (route level code-splitting)
    ]
})

router.beforeEach((to, from, next) => {
    console.log("to.meta.requiresAuth",to.meta.requiresAuth)
    console.log("!isAuthenticated()",!isAuthenticated())
    if (to.meta.requiresAuth /*&& !isAuthenticated()*/ ) {
        // console.log("HERE", from);
        next({ name: 'sign-in'}); 
    } else {
        next(); 
    }
})

export default router; 