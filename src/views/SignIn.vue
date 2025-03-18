<template>

    <div class="sign-in-container"> 
        <div class="sign-in-body-container">
            <h1 class="mb-2">Sign In</h1>
    
            <form @submit.prevent="handleSubmit" class="mb-2">
                <div>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required v-model="email">
                </div>
                
                <div>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required v-model="password">
                </div>
    
                <button type="submit" class="btn">Login</button>
            </form>
    
            <!-- <button @click="signInWithGoogle">Sign in with Google</button> -->
    
            <button class="btn w-100" @click="resetPassword">Reset Password</button>
    
            <p v-if="errorMessage" class="error">{{ errorMessage  }}</p>
        </div>

    </div>

    

    

    <!-- <div>
        <RouterLink to="/sign-up">Create Account</RouterLink>
    </div> -->

    <!-- <button @click="signOut">Sign Out</button> -->

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

// const signInWithGoogle = async () => {
//     // debugger;
//     const redirectUrl = window.location.origin; 
//     console.log(redirectUrl)
//     const { data, error } = await supabase.auth.signInWithOAuth({
//         provider: 'google',
//         options: {
//             redirectTo: redirectUrl
//         }
//     });
// };

// const signOut = async () => {
//     await supabase.auth.signOut(); 
// } 



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

<style scoped>
.sign-in-container { 
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #181818;
}

.sign-in-body-container { 
    background-color: #222;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
    text-align: center;
}

.sign-in-body-container h1 {
    font-size: 1.8rem;
    color: #fff;
    margin-bottom: 2rem;
}


.sign-in-body-container form { 
    display: flex;
    flex-direction: column;
    gap: 1rem;
}


.sign-in-body-container form div {
    display: flex;
    align-items: center;
    gap: 1rem;
}

label {
    font-size: 1rem;
    font-weight: bold;
    color: #bbb;
    width: 80px; /* Fixed width so labels align nicely */
    text-align: right;
}

input {
    flex: 1;
    padding: 10px;
    border: 1px solid #444;
    border-radius: 6px;
    background-color: #333;
    color: white;
    font-size: 1rem;
    outline: none;
}

input:focus {
    border-color: #888;
}


</style>