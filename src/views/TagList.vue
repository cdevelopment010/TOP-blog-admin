<template>
    <div class="container">
        <div class="nav-container">
            <NavComponent />
        </div>
        <div class="body-container">
            <h1>Tags</h1>
            <button @click="showModal = true; createEditTag='Create'">Create Tag</button>

            <template v-if="errorMsg">
                <span>There was an error getting the data!</span>
                <div>
                    {{ errorMsg }}
                </div>
            </template>
        
            <template v-for="(tag, index) in tagList" :key="index">
                <div class="d-flex align-items-center justify-content-center mb-2 mt-2">
                    <span class="me-2 flex-start">{{ tag?.name }}</span>
                    <span class="me-2 flex-start">{{ tag?.createdByUser }}</span>
                    <span class="me-2 flex-start">{{ new Date(tag?.createdAt).toLocaleDateString() }} {{ new Date(tag?.createdAt).toLocaleTimeString() }}</span>
                    <div class="d-flex flex-start">
                        <button @click="editTag(tag)" class="me-2">Edit</button>
                        <button @click="deleteTag(tag.id)">Delete</button>
                    </div>
                </div>
                <hr>
            </template>
        </div>
        
    </div>
    <ModalComponent :show="showModal" @close="showModal = false">
        <template #header>
            <h3>{{ createEditTag }} Tag</h3>
        </template>
        <template #default>
            <div>
                <label for="name">Tag Name:</label>
                <input type="text" v-model="tagName" id="name" name="name" required>
            </div>
        </template>
        <template #footer>
            <div class="mt-2">
                <button @click="submit" class="me-2">Submit</button>
                <button @click="showModal = false">Cancel</button>
            </div>
        </template>
    </ModalComponent>

</template>

<script setup lang="ts">
import NavComponent from '../components/nav.vue';
import ModalComponent from '../components/modal.vue';
import { onMounted, ref } from "vue"; 
import { currentUser } from '../utils/auth'

interface Tag { 
    id:number,
    name: string, 
    createdById: number, 
    createdByUser: string, 
    createdAt: Date, 
    updatedById: number, 
    updatedAt: Date, 
}

const createEditTag = ref<string>("Create"); 
const showModal = ref(false);
const tagName = ref("");
const currentTag = ref<Tag|null>(null); 
const tagList = ref<Tag[]>([]); 
const errorMsg = ref(""); 

const refreshTags = async () => {
    await fetch('https://top-blog-api-production.up.railway.app/tag/', {
                mode: 'cors',
                method: 'GET', 
                headers: { 'Content-Type': 'application/json', 'authorization': `bearer: ${localStorage.getItem('jwt')}`},

            }).then(async response => {
                if (!response.ok)
                {  
                    console.log("ERROR: Tags - ",response.json)
                    return new Error(`Error ${response.json}`)
                } else { 
                    let data = await response.json(); 
                    tagList.value = data.data; 
                    showModal.value = false;
                }
            }).catch( err => {
                console.error(err); 
            })
}

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
        await refreshTags(); 
    })
    .catch(err => {
        console.error(err); 
        errorMsg.value = err.message; 
    })
}

const editTag = async (tag: Tag) => {
    createEditTag.value = 'Edit';     
    tagName.value = tag.name; 
    currentTag.value = tag; 
    showModal.value = true; 

}


const submit = async () => {
    if (currentTag.value){
        currentTag.value.name = tagName.value; 
        await fetch(`https://top-blog-api-production.up.railway.app/tag/${currentTag.value.id}`, {
            mode: 'cors',
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json', 'authorization': `bearer: ${localStorage.getItem('jwt')}`},
            body: JSON.stringify({name: tagName.value, currentUser: currentUser.value, tag: currentTag.value})
        })
        .then(async response => {
            if(!response.ok) {
                const data = await response.json(); 
                throw new Error(data.message)
            }        
            await refreshTags(); 
        })
        .catch(err => {
            console.error(err); 
            errorMsg.value = err.message; 
        })
    } else { 
        // await fetch(`http://localhost:3000/tag/`, {
        await fetch(`https://top-blog-api-production.up.railway.app/tag/`, {
            mode: 'cors',
            method: 'POST', 
            headers: { 'Content-Type': 'application/json', 'authorization': `bearer: ${localStorage.getItem('jwt')}`},
            body: JSON.stringify({name: tagName.value, currentUser: currentUser.value})
    
        })
        .then(async response => {
            if(!response.ok) {
                const data = await response.json(); 
                throw new Error(data.message)
            }
            await refreshTags();            
        })
        .catch(err => {
            console.error(err); 
            errorMsg.value = err.message; 
        })
    }
     
}



onMounted(async () => {
    await refreshTags(); 
})
</script>

<style>
    .me-2 { margin-right: 0.5rem;}
    .mb-2 { margin-bottom: 0.5rem;}
    .mb-3 { margin-bottom: 0.75rem;}
    .mb-4 { margin-bottom: 1rem;}
    .mt-2 { margin-top: 0.5rem;}
    .mt-3 { margin-top: 0.75rem;}
    .mt-4 { margin-top: 1rem;}
</style>