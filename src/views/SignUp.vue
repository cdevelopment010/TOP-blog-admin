<template>
    <h1>
        Create Account
    </h1>

    <form @submit.prevent="signUpWithEmail(email, password)">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required v-model="name">

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required v-model="email">
        
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required v-model="password">
        
        <label for="confirm-password">Confirm Password:</label>
        <input type="password" id="confirm-password" name="confirm-password" required v-model="confirmPassword">

        <button type="submit">Create Account</button>
    </form>

    <p v-if="errorMessage" class="error">{{ errorMessage  }}</p>

    <div>
        <RouterLink to="/sign-up">Create Account</RouterLink>
    </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { ref  } from 'vue';
import { currentUser } from '../utils/auth';
import { supabase } from '../utils/supabase';

const router = useRouter(); 

const email = ref('');
const password = ref(''); 
const confirmPassword = ref(''); 
const name=ref('');
const errorMessage = ref(''); 


async function signUpWithEmail(email: string, password: string) {

  const {data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error('Error signing up:', error.message);
  } else {
    console.log('Sign-up successful:', data);
    try { 
        const response = await fetch('https://top-blog-api-proud-thunder-6960.fly.dev/user/', {
            method: 'POST', 
            mode: 'cors',
            headers: { 'Content-Type': 'application/json'}, 
            body: JSON.stringify({ email: email, password: password, confirmPassword: confirmPassword.value, name: name.value, admin: true})
        })
        
        if (!response.ok) { throw new Error('Failed to log in')}
        const data = await response.json(); 

        // save JWT token to local storage
        localStorage.setItem('jwt', data.token)

        if (data.user) {
            currentUser.value = data.user; 
        }

        //redirect needed
        router.push("/")
        
    } catch (err: any) {
        errorMessage.value = err.message; 
    }
  }
}


</script>