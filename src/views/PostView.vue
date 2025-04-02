<template>
    <div class="container">
        <div class="nav-container">
            <NavComponent />
        </div>
        
        <div class="body-container w-80 mx-auto w-md-50">
            <h1 style="text-align: left;">Posts</h1>
            <div class="d-flex flex-column p-5 border border-radius-1">
                <RouterLink to="/posts/new-post" class="ms-auto mb-2">Create Post</RouterLink>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Created</th>
                            <th>Published</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(post, index) in posts" :key="`post-${index}`">
                            <tr>
                                <td>{{ post.title }}</td>
                                <td width="200px">{{ new Date(post.createdAt).toLocaleDateString() }} {{ new Date(post.createdAt).toLocaleTimeString() }}</td>
                                <td width="80px"> 
                                    <input type="checkbox" :checked="post.published" @click="changePostPublish(post.published, post.id)"/>
                                </td>
                                <td width="200px">
                                    <RouterLink :to="`/posts/update-post/${post.id}`" class="btn me-2"><i class="fa-solid fa-pen-to-square"></i></RouterLink>
                                    <button class="btn me-2" @click="deletePost(post.id)"><i class="fa-solid fa-trash"></i></button>
                                    <!-- <RouterLink :to="`/posts/preview-post/${post.id}`" class="btn me-2">Preview</RouterLink> -->
                                    <RouterLink :to="{path: `/posts/${post.id}/comments`, query: {title: post.title}}" class="btn me-2"><i class="fa-solid fa-comments"></i></RouterLink>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
            
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"; 
import NavComponent from '../components/nav.vue';
import { RouterLink } from "vue-router";

interface Post {
    id: number
}

const posts = ref();

const refreshPosts = async () => {
    // await fetch('https://top-blog-api-production.up.railway.app/post/', {
    await fetch('https://top-blog-api-proud-thunder-6960.fly.dev/post/', {
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

async function publishPost(postId:number) { 
    // await fetch(`http://localhost:3000/post/publish/${postId}`, {
    await fetch(`https://top-blog-api-proud-thunder-6960.fly.dev/post/publish/${postId}`, {
                mode: 'cors',
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', 'authorization': `bearer: ${localStorage.getItem('jwt')}`},
            }).then(async response => {
                if (!response.ok)
                {  
                    console.log("ERROR: Tags - ",response)
                    return new Error(`Error ${response}`)
                } else { 
                    let data = await response.json(); 
                    console.log(posts.value);
                }
            }).catch( err => {
                console.error(err); 
            })
}
async function unpublishPost(postId:number) { 
    // await fetch(`http://localhost:3000/post/unpublish/${postId}`, {
        await fetch(`https://top-blog-api-proud-thunder-6960.fly.dev/post/unpublish/${postId}`, {
                mode: 'cors',
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', 'authorization': `bearer: ${localStorage.getItem('jwt')}`},
            }).then(async response => {
                if (!response.ok)
                {  
                    console.log("ERROR: Tags - ",response)
                    return new Error(`Error ${response}`)
                } else { 
                    let data = await response.json(); 
                    console.log(posts.value);
                }
            }).catch( err => {
                console.error(err); 
            })
}

async function changePostPublish(published: boolean, postId: number): Promise<void> { 
    if (published) {
        //unpublish
        await unpublishPost(postId); 
    } else { 
        //publish
        await publishPost(postId); 
    }

    //refresh post after changes
    await refreshPosts(); 
}

async function deletePost(id: number) : Promise<void> {

    //need some sort of warning here.
    await fetch(`https://top-blog-api-proud-thunder-6960.fly.dev/post/${id}`, {
        mode: 'cors',
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json', 'authorization': `bearer: ${localStorage.getItem('jwt')}`},

    })
    .then(async response => {
        if(!response.ok) {
            const data = await response.json(); 
            throw new Error(data.message)
        }
        await refreshPosts(); 
    })
    .catch(err => {
        console.error(err);  
    })
}

onMounted(async () => {
    await refreshPosts(); 
})


</script>

<style scoped>

</style>