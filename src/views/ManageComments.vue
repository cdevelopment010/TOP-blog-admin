<template>
    <div class="container">
        <div class="nav-container">
            <NavComponent />
        </div>

        <div class="body-container">
            <h1>Comments</h1>
            <h3>{{ title }}</h3>

            <div v-if="loading">Loading...</div>

            <template v-for="comment in comments" :key="comment.id">
                <div class="d-flex justify-content-between"  style="width: 80ch;margin-inline:auto">
                    <div class="d-flex flex-column align-items-start">
                        <span>{{ comment.createdAt }}</span>
                        <span>{{ comment.comment }}</span>
                    </div>
                    <button class="btn btn-danager" @click="deleteComment(comment.id)">
                        DELETE ME!  
                    </button>
                    
                </div>
            </template>
        </div>
    </div>

    <Toasts />

</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue"; 
import { useRoute, useRouter } from 'vue-router';
import NavComponent from '../components/nav.vue';
import Toasts from "../components/Toasts.vue";
import { useToast } from "../utils/useToast";

const route = useRoute(); 
const { addToast } = useToast(); 
const title = computed(() => route.query.title);

const loading = ref<boolean>(true);
const postId = ref<number | null>(null); 
const comments = ref(); 


const getCommentsByPostId = async (postId: number)  => {
    const url = `https://top-blog-api-proud-thunder-6960.fly.dev/post/${postId}/comments`; 

    await fetch(url, {
                mode: 'cors',
                method: 'GET', 
                headers: { 'Content-Type': 'application/json', 'authorization': `bearer: ${localStorage.getItem('jwt')}`},
    }).then(async response => {
        if (!response.ok) { 
            loading.value = false;
            addToast({ title: 'Error!', message: 'There was an error retrieving the comments for the post.', type: 'danger', timeout: 3000})
            return new Error(`Error ${response}`)
        }
        let data = await response.json(); 
        comments.value = data.data; 
        console.log("comments:",comments.value);
        loading.value = false;
    })
    .catch(error => {
        loading.value = false;

        addToast({ title: 'Error!', message: `There was an error retrieving the comments for the post. \n ${error.message}`, type: 'danger', timeout: 3000})
        return new Error(`Error ${error.message}`)
    })
}

const deleteComment = async (commentId : number) => {
    const url = `https://top-blog-api-proud-thunder-6960.fly.dev/post/${postId.value}/comments/${commentId}`; 
    // const url = `http://localhost:3000/post/${postId.value}/comments/${commentId}`; 
    console.log(localStorage.getItem('jwt'));
    await fetch(url, {
                mode: 'cors',
                signal: AbortSignal.timeout(30 * 1000),
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json', 'authorization': `bearer: ${localStorage.getItem('jwt')}`},
    }).then(async response => {
        if (!response.ok) { 
            addToast({ title: 'Error!', message: 'There was an error deleting the comment.', type: 'danger', timeout: 3000})
            return new Error(`Error ${response}`)
        }
        loading.value = true;
        await getCommentsByPostId((postId.value as number));
    })
    .catch(error => {
        addToast({ title: 'Error!', message: `There was an error deleting the comment. \n\r ${error.message}`, type: 'danger', timeout: 3000})
        return new Error(`Error ${error.message}`)
    })
}

onMounted(() => {
    console.log("Manage Comments:", route.params.id); 
    if (route.params.id) { 
        postId.value = parseInt(route.params.id as string);

        getCommentsByPostId(postId.value);

    }
})

</script>