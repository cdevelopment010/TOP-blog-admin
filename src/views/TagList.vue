<template>
    <div class="container">
        <div class="nav-container">
            <NavComponent />
        </div>
        <div class="body-container  w-80 mx-auto w-md-50">
            <h1  style="text-align: left;">Tags</h1>

            <div class="d-flex flex-column p-5 border border-radius-1">
                <button @click="showModal = true; createEditTag='Create'" class="ms-auto mb-2">Create Tag</button>
                <template v-if="errorMsg">
                    <span>There was an error getting the data!</span>
                    <div>
                        {{ errorMsg }}
                    </div>
                </template>

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <!-- <th>created By User</th> -->
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(tag, index) in tagList" :key="`tag-${index}`">
                            <tr>
                                <td>{{ tag.name }}</td>
                                <!-- <td>{{ tag.createdByUser }}</td> -->
                                <td width="200px">{{ new Date(tag.createdAt).toLocaleDateString() }} {{ new Date(tag.createdAt).toLocaleTimeString() }}</td>
                                <td width="200px">
                                    <button @click="editTag(tag)" class="me-2"><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button @click="deleteTag(tag.id)"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>

            </div>

        
            <!-- <template v-for="(tag, index) in tagList" :key="index">
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
            </template> -->
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
    await fetch('https://top-blog-api-proud-thunder-6960.fly.dev/tag/', {
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
    await fetch(`https://top-blog-api-proud-thunder-6960.fly.dev/tag/${tagId}`, {
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
        await fetch(`https://top-blog-api-proud-thunder-6960.fly.dev/tag/${currentTag.value.id}`, {
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
        await fetch(`https://top-blog-api-proud-thunder-6960.fly.dev/tag/`, {
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
    
</style>