<template>
    <div class="container">
        <div class="nav-container">
            <NavComponent />
        </div>
        <div class="body-container w-80 mx-auto">
            <h1>Home</h1>
            <div class="grid_2x2">
                <Card> 
                    <template #card-header>
                        Number of posts: {{  countData?.totalPostCount ?? 0 }}
                    </template>
                </Card>
                <Card> 
                    <template #card-header>
                        Number of published posts: {{ countData?.publishedPosts ?? 0 }}
                    </template>
                </Card>
                <Card> 
                    <template #card-header>
                        Number of comments: {{ countData?.totalComments ?? 0 }}
                    </template>
                </Card>
                <Card> 
                    <template #card-header>
                        Number of likes: {{countData?.totalLikes?._sum?.numberOfLikes ?? 0 }}
                    </template>
                </Card>

            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"; 
import NavComponent from '../components/nav.vue';
import Card from "../components/card.vue";

const countData = ref(); 

    
const getCountData = async () => {
    await fetch('https://top-blog-api-proud-thunder-6960.fly.dev/post/getAllCounts', {
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
                    countData.value = data.data; 
                    console.log(countData.value);
                }
            }).catch( err => {
                console.error(err); 
            })
}

onMounted(() => {
    getCountData(); 
})

</script>

<style scoped>
.grid_2x2 { 
    display: grid; 
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr; 
    gap: 1rem; 

}
</style>