<template> 
<div class="toolbar">
    <button @click="applyFormatting('bold')">Bold</button>
    <button @click="applyFormatting('italic')">Italic</button>
    <button @click="applyFormatting('highlight')">Highlight</button>
    <input v-model="linkInput" placeholder="Enter link URL" />
    <button @click="applyFormatting('link')">Add Link</button>
</div>

</template>

<script setup lang="ts">
import { ref } from "vue"; 

const emits = defineEmits<{
    (event: 'applyFormatting', format: string, url?: string) : void
}>(); 

const linkInput = ref<string>(""); 

const applyFormatting = (value: string) => {
    if (value == 'link') {
        emits('applyFormatting', value, linkInput.value);
    } else { 
        emits('applyFormatting', value); 
    }
}

</script>