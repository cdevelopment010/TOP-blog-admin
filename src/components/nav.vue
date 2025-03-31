<template>
    <nav class="gap-2 flex-wrap">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/posts">Posts</RouterLink>
        <RouterLink to="/tags">Tags</RouterLink>
        <a href="https://analytics.google.com/analytics/web/?authuser=1#/p471201004/reports/intelligenthome" target="_blank">Analytics</a>

        <div>
            <button id="theme-switcher" @click="changeThemes">
                <span v-if="theme=='dark'"><i class="fa-solid fa-sun"></i></span>
                <span v-if="theme=='light'"><i class="fa-solid fa-moon"></i></span>
            </button>
        </div>

        <div class="last-item">
            <button @click="signOut" class="btn">Sign out</button>
        </div>
    </nav>

</template>

<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import { onMounted, ref } from "vue";
    import { supabase } from '../utils/supabase';

    const theme = ref<string>("dark"); 

    const changeThemes = () => {
        theme.value = theme.value == 'dark' ? 'light' : 'dark';
        document.body.className = theme.value; 
        localStorage.setItem('theme-selector', theme.value);
    }

    const signOut = async () => {
        console.log("SignOut")
        await supabase.auth.signOut().then(() => console.log("Signed Out complete")); 
    }


    onMounted(() => {
        theme.value = localStorage.getItem('theme-selector') || 'dark'; 
        document.body.className = theme.value; 
    })

</script>