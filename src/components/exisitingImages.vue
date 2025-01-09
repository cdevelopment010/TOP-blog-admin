<template>

        <div v-if="images.length === 0">No images found.</div>
        <ul>
        <li v-for="image in images" :key="image.name">
            <img :src="image.publicUrl" alt="Uploaded Image" width="100" />
            <button @click="selectImage(image.publicUrl)">Use this image</button>
        </li>
        </ul>
</template>

<script setup lang="ts">
    import { ref, onMounted } from "vue"; 
    import { supabase } from "../utils/supabase"; 

    const emit = defineEmits<{
        (event:'selectImage', url: string | null) : void
    }>();

    const images = ref<{ name: string; publicUrl: string }[]>([]);
    const imageUrl = ref<string | null>(null);

    async function fetchImages() : Promise<void> {
        const { data, error } = await supabase.storage.from('posts').list(); 

        if (error) {
            console.error('Error fetching images:', error.message); 
            return; 
        }

        if (data) {
            images.value = data.map((file)=> ({
                name: file.name, 
                publicUrl: supabase.storage.from('posts').getPublicUrl(file.name).data?.publicUrl || ''
            }))
        }
    }

    const selectImage = (url: string) => {
        console.log('Selected Image URL:', url);
        imageUrl.value = url; 
        emit("selectImage", imageUrl.value);
    };

    onMounted(async() => {
        await fetchImages(); 
    })


</script>