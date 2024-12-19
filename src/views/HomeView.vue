<template>
    <div class="container">
        <div class="nav-container">
            <NavComponent/>

        </div>
        <div class="body-container">
            <h1>Home</h1>
            <div>
                Things to put on the home page
                <ul>
                    <li>Count of posts</li>
                    <li>Count of published posts</li>
                    <li>Most viewed post</li>
                    <li>Most commented post</li>
                    <li>Total comments</li>
                    <li>Total views</li>
                </ul>
            </div>
            <!-- Current route {{  $route.name }} -->
        </div>
    </div>

</template>

<script setup lang="ts">
    import NavComponent from '../components/nav.vue';
</script>