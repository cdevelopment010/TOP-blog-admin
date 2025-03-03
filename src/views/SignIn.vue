<template>
    <h1>
        Sign In
    </h1>

    <form @submit.prevent="handleSubmit">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required v-model="email">
        
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required v-model="password">

        <button type="submit">Login</button>
    </form>


    <!-- <div
        id="g_id_onload"
        data-client_id="182128599079-tc9jp5huhpuk1vt564r5084iuj9gtu00.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleSignInWithGoogle"
        data-nonce=""
        data-auto_select="true"
        data-itp_support="true"
        data-use_fedcm_for_prompt="true"
        ></div>

        <div
        class="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
        ></div> -->

    <button @click="signInWithGoogle">Sign in with Google</button>

    <button class="btn" @click="resetPassword">Reset Password</button>

    <p v-if="errorMessage" class="error">{{ errorMessage  }}</p>

    <!-- <div>
        <RouterLink to="/sign-up">Create Account</RouterLink>
    </div> -->

    <Toasts />
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted  } from 'vue';
import { currentUser } from '../utils/auth'
import { supabase } from '../utils/supabase';
import Toasts from '../components/Toasts.vue';
import { useToast } from '../utils/useToast';

const router = useRouter(); 
const { addToast } = useToast(); 

const email = ref('');
const password = ref(''); 
const errorMessage = ref(''); 

const resetPassword = async () => {
    if (email.value == "" || !email.value) {
        throw new Error("Missing email.")
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email.value, {
        // redirectTo: "http://localhost:5173/reset-password"
        redirectTo: "https://admin.coffeeshopcoding.dev/reset-password"
    })
}

// async function handleSignInWithGoogle(response :any) {
//     console.log("Response", response);
//     const { data, error } = await supabase.auth.signInWithIdToken({
//         provider: 'google',
//         token: response.credential,
//     }); 

//     if (error) {
//         console.error("Supabase login error:", error);
//         addToast({ title: "Error!", message: error.message, type: "danger", timeout: 3000 });
//     } else {
//         console.log("Supabase login success:", data);
//         router.push("/"); // Redirect to home after login
//     }
// }

const signInWithGoogle = async () => {
    debugger;
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'https://syukwgbfweshgnfgcorp.supabase.co/auth/v1/callback', 
            // flow: 'implicit'
        }
    });

    console.log("Google sign-in response:", data);

    if (error) {
        addToast({ title: "Error!", message: error.message, type: "danger", timeout: 3000 });
        console.error("Google Sign-In Error:", error);
    } else {
        console.log("Google Sign-In Success:", data);   
        router.push("/")
    }   
};



const handleSubmit = async () => {
    try { 
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value, 
            password: password.value
        })

        if (error) {
            addToast({title: "Error!", message: "Unable to login. Please try again.", type: "danger", timeout: 3000});  
            throw new Error(error.message);
        }
        console.log("Log in!", data);

        const response = await fetch('https://top-blog-api-proud-thunder-6960.fly.dev/auth/login', {
            method: 'POST', 
            mode: 'cors',
            headers: { 'Content-Type': 'application/json'}, 
            body: JSON.stringify({ email: email.value, password: password.value})
        })
        
        if (!response.ok) { throw new Error('Failed to log in')}
        const dataResponse = await response.json(); 
        // save token
        localStorage.setItem('jwt', dataResponse.token)
        //save current user
        if (data.user) {
            currentUser.value = dataResponse.user; 
        }

        //redirect needed
        router.push("/")
    } catch (err: any) {
        errorMessage.value = err.message; 
    }
}

</script>