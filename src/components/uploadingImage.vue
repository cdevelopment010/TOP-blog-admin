<template>
    <input type="file" @change="uploadImage" accept="image/*">
    <p v-if="imageUrl">Image uploaded! <a :href="imageUrl" target="_blank">View image</a></p>

</template>

<script setup lang="ts">
    import { ref } from "vue"; 
    import { supabase } from "../utils/supabase"; 
    import { imageResize } from '../utils/imageResize'; 
    
    const emit = defineEmits<{
        (event:'uploadImage', url: string | null) : void
    }>();


    const imageUrl = ref<string | null>(); 
    const uploadImage = async (event: Event) => {
        

        const target = event.target as HTMLInputElement;
        const file = target.files?.[0]; 

        if (!file){
            alert("No file selected."); 
            return;
        } 

        const resizedBlob = await imageResize(file); 
        console.log(resizedBlob); 

        if (!resizedBlob) {
            console.error("Failed to resize the image. Blob is null.");
            return;
        }

        const filePath = `${file.name}`; 
        const { data: uploadData, error } = await supabase.storage
            .from("posts")
            .upload(filePath, resizedBlob, {
                cacheControl: "3600",
                upsert: false,
                contentType: "image/jpeg",
            }); 

        if (error) {
            console.error("Error uploading file:", error.message); 
            return; 
        }

        //public url to save
        const { data  } = supabase.storage.from("posts").getPublicUrl(filePath);
        if (data) {
            imageUrl.value = data.publicUrl;
            console.log('Image URL:', data.publicUrl);
            emit("uploadImage", imageUrl.value);
        } else {
            console.error('Failed to retrieve the public URL.');
        }
    }

</script>