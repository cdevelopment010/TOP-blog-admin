<template>
    <div class="container">
        <div class="nav-container">

            <NavComponent />
        </div>
        
        <div class="body-container">
            <h1>Posts</h1>
            <RouterLink to="/posts/new-post">Create Post</RouterLink>
            <template v-for="(post, index) in posts" :key="`post-${index}`">
                <div>
                    {{ post.title }}
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"; 
import NavComponent from '../components/nav.vue';
import ModalComponent from '../components/modal.vue';

interface Post {
    id: number
}

const posts = ref();

const refreshPosts = async () => {
    await fetch('https://top-blog-api-production.up.railway.app/post/', {
                mode: 'cors',
                method: 'GET', 
                headers: { 'Content-Type': 'application/json', 'authorization': `bearer: ${localStorage.getItem('jwt')}`},
            }).then(async response => {
                if (!response.ok)
                {  
                    console.log("ERROR: Tags - ",response)
                    return new Error(`Error ${response}`)
                } else { 
                    let data = await response.json(); 
                    posts.value = data.data; 
                    console.log(posts.value);
                }
            }).catch( err => {
                console.error(err); 
            })
}


onMounted(async () => {
    await refreshPosts(); 
})


</script>