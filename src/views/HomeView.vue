<template>
    <div class="container">
        <div class="nav-container">
            <NavComponent/>

        </div>
        <div class="body-container">
            <h1>Home</h1>
            <div> some cool content for my homepage</div>
            Current route {{  $route.name }}
        </div>
    </div>

</template>

<script setup lang="ts">
    import NavComponent from '../components/nav.vue';
</script>