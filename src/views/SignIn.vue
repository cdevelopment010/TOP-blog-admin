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

    <p v-if="errorMessage" class="error">{{ errorMessage  }}</p>

    <div>
        <RouterLink to="/sign-up">Create Account</RouterLink>
    </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { ref  } from 'vue';
import { currentUser } from '../utils/auth'

const router = useRouter(); 

const email = ref('');
const password = ref(''); 
const errorMessage = ref(''); 

const handleSubmit = async () => {
    try { 
        // const response = await fetch('http://localhost:3000/auth/login', {
        const response = await fetch('https://top-blog-api-production.up.railway.app/auth/login', {
            method: 'POST', 
            mode: 'cors',
            headers: { 'Content-Type': 'application/json'}, 
            body: JSON.stringify({ email: email.value, password: password.value})
        })
        
        if (!response.ok) { throw new Error('Failed to log in')}
        const data = await response.json(); 
        // save token
        localStorage.setItem('jwt', data.token)
        //save current user
        if (data.user) {
            currentUser.value = data.user; 
        }

        //redirect needed
        router.push("/")
    } catch (err: any) {
        errorMessage.value = err.message; 
    }
}

</script>