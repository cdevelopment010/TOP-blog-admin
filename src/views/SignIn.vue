<template>
    <h1>
        Sign In
    </h1>

    <form @submit.prevent="handleSubmit">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>

        <button type="submit">Login</button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage  }}</p>

    <div>
        <RouterLink to="/sign-up">Create Account</RouterLink>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref  } from 'vue';

const email = ref('');
const password = ref(''); 
const errorMessage = ref(''); 

const handleSubmit = async () => {
    try { 
        const response = await fetch('...url', {
            method: 'POST', 
            mode: 'cors',
            headers: { 'Content-Type': 'application/json'}, 
            body: JSON.stringify({ email: email.value, password: password.value})
        })
        
        if (!response.ok) { throw new Error('Failed to log in')}
        const data = await response.json(); 
        console.log('Login successful', data); 

        //redirect needed
    } catch (err: any) {
        errorMessage.value = err.message; 
    }
}

</script>