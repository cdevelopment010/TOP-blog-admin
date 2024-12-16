<template>
    <NavComponent />
    <h1>Tags</h1>
    <button @click="showModal = true">Create Tag</button>
    <ModalComponent :show="showModal" @close="showModal = false">
            <template #header>
                <h3>Create Tag</h3>
            </template>
            <template #default>
                <label for="name">Tag Name:</label>
                <input type="text" v-model="tagName" id="name" name="name" required>
            </template>
            <template #footer>
                <button @click="submit">Submit</button>
                <button @click="showModal = false">Cancel</button>
            </template>
        </ModalComponent>

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
import ModalComponent from '../components/modal.vue';
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

const showModal = ref(false)
const tagName = ref("");
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


const submit = async () => {
    console.log(tagName.value); 

    //issue with API - currentUser not defined.
    //But the error message isn't coming back to the front end. 
    await fetch(`https://top-blog-api-production.up.railway.app/tag/`, {
        mode: 'cors',
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', 'authorization': `bearer: ${localStorage.getItem('jwt')}`},
        body: JSON.stringify({name: tagName.value})

    })
    .then(async response => {
        if(!response.ok) {
            const data = await response.json(); 
            throw new Error(data.message)
        }
        showModal.value = false;
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