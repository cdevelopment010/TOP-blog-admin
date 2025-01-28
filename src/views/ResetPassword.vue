<template>
    <h1>Reset Password</h1>
    <form @submit.prevent="handleSubmit">
        <div>
            <label>New Password</label>
            <input v-model="newPassword" type="password">
        </div>
        <div>
            <label>Confirm Password</label>
            <input v-model="confirmPassword" type="password">
        </div>

        <button type="submit">Save</button>
    </form>
</template>

<script setup lang="ts">
import {ref } from "vue"; 
import { supabase } from "../utils/supabase";
import { currentUser } from "../utils/auth";
import { useRouter } from "vue-router";

const router = useRouter(); 
const newPassword = ref<string>(""); 
const confirmPassword = ref<string>("");

const handleSubmit = async() => {
    if (newPassword.value == "") { 
        throw new Error("Password cannot be empty")
    }
    if (newPassword.value != confirmPassword.value) { 
        throw new Error("Passwords must match")
    }
    try { 
        const { data, error } = await supabase.auth.updateUser({ 
            password: newPassword.value
        }); 

        if (error) { 
            console.error("Error resetting password:", error.message);
            return;
        }
        console.log("currentUser", currentUser.value)

        const response = await fetch('https://top-blog-api-proud-thunder-6960.fly.dev/user/updatePassword', {
            method: 'PUT', 
            mode: 'cors',
            headers: { 'Content-Type': 'application/json'}, 
            body: JSON.stringify({ currentUser: currentUser, newPassword: newPassword.value })
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
    } catch(err) {
        console.error("An error occured when resetting password", err);
    }
}

</script>