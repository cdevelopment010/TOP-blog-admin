<template> 
<div class="m-0">
    <span class="pointer me-2" @click="applyFormatting('bold')" ><b>B</b></span>
    <span class="pointer me-2" @click="applyFormatting('italic')"><i>I</i></span>
    <span class="pointer me-2" @click="applyFormatting('highlight')">Highlight</span>
    <input class=" me-2" v-model="linkInput" placeholder="Enter link URL" />
    <span class="pointer me-2" @click="applyFormatting('link')">Add Link</span>
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