<template>
    <div v-if="show">
        <h3>Create Tag:</h3>

        <div v-if="errorMessage">{{ errorMessage }}</div>

        <label for="name">Tag Name:</label>
        <input type="text" v-model="tagName" id="name" name="name" required>
        <button @click="submit"></button>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue"; 

    const show = ref(false);
    const errorMessage = ref("");
    const tagName = ref(""); 

    const submit = async () => {
        fetch("https://top-blog-api-production.up.railway.app/tag/", {
            mode: "cors",
            method: "POST",
            headers: { 'Content-Type': 'application/json', 'authorization': `bearer: ${localStorage.getItem('jwt')}`}, 
            body: JSON.stringify({name: tagName.value})
        }).then(()=> {
            show.value = false; 
        }).catch(err => {
            console.error(err); 
            errorMessage.value = err.message; 
        })
    }
</script>