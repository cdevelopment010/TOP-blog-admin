<template>

    <NavComponent/>
    <div> some cool content for my homepage</div>

    Current route {{  $route.name }}
</template>

<script setup lang="ts">
    import NavComponent from '../components/nav.vue';
</script>