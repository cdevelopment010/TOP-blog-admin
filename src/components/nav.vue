<template>
    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/posts">Posts</RouterLink>
        <RouterLink to="/tags">Tags</RouterLink>

        <div>
            <button id="theme-switcher" @click="changeThemes">
                <span v-if="theme=='dark'"><i class="fa-solid fa-sun"></i></span>
                <span v-if="theme=='light'"><i class="fa-solid fa-moon"></i></span>
            </button>
        </div>
    </nav>

</template>

<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import { onMounted, ref } from "vue";

    const theme = ref<string>("dark"); 

    const changeThemes = () => {
        theme.value = theme.value == 'dark' ? 'light' : 'dark';
        document.body.className = theme.value; 
        localStorage.setItem('theme-selector', theme.value);
    }


    onMounted(() => {
        theme.value = localStorage.getItem('theme-selector') || 'dark'; 
        document.body.className = theme.value; 
    })

</script>