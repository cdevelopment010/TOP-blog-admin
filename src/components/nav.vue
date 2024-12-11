<template>
    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/posts">Posts</RouterLink>
        <RouterLink to="/tags">Tags</RouterLink>
    </nav>

</template>

<script setup lang="ts">
    import { RouterLink } from 'vue-router';
</script>