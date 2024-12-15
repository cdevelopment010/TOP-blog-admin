<template>
    <NavComponent />
    <h1>Tags</h1>
    <RouterLink to="w">Create Tag</RouterLink>

    <template v-if="errorMsg">
        <span>There was an error getting the data!</span>
        <div>
            {{ errorMsg }}
        </div>
    </template>

    <template v-for="(tag, index) in tagList" :key="index">
        <div>
            <span>{{ tag?.name }}</span>
            <span>{{ tag?.createdByUser }}</span>
            <span>{{ tag?.createdAt }}</span>
            <button @click="deleteTag(tag.id)">Delete</button>
        </div>
    </template>
</template>

<script setup lang="ts">
import NavComponent from '../components/nav.vue';
import { onMounted, ref } from "vue"; 

interface Tag { 
    id:number,
    name: string, 
    createdById: number, 
    createdByUser: string, 
    createdAt: Date, 
    updatedById: number, 
    updatedAt: Date, 
}

const tagList = ref<Tag[]>([]); 
const errorMsg = ref(""); 

const deleteTag = async (tagId: number) => {
    await fetch(`https://top-blog-api-production.up.railway.app/tag/${tagId}`, {
        mode: 'cors',
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json', 'authorization': `bearer: ${localStorage.getItem('jwt')}`},

    })
    .then(async response => {
        if(!response.ok) {
            const data = await response.json(); 
            throw new Error(data.message)
        }
    })
    .catch(err => {
        console.error(err); 
        errorMsg.value = err.message; 
    })
}
onMounted(async () => {
    console.log(localStorage.getItem('jwt')); 
    const response = await fetch('https://top-blog-api-production.up.railway.app/tag/', {
        mode: 'cors',
        method: 'GET', 
        headers: { 'Content-Type': 'application/json', 'authorization': `bearer: ${localStorage.getItem('jwt')}`},

    })

    if (!response.ok)
    {  
        console.log("ERROR: Tags - ",response.json)
    } else { 
        let data = await response.json(); 
        console.log('Tags data:', data); 
        tagList.value = data.data; 
    }

})
</script>