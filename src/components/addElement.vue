<template>

    <div class="add-element" @click="() => {emits('showAddElement'); addElement = !addElement}">
        <div class="hr"></div>  
        <i class="fa-solid fa-circle-plus"></i>
    </div>

    <div class="editor " v-if="addElement" @blur="addElement = false">
        <button @click="addBlock('paragraph')" title="paragraph" class="d-flex align-items-center justify-content-center"><i class="fa-solid fa-paragraph"></i></button>
        <button @click="addBlock('header1')" title="heading 1" class="d-flex align-items-center justify-content-center"><i class="fa-solid fa-heading"></i>1</button>
        <button @click="addBlock('header2')" title="heading 2" class="d-flex align-items-center justify-content-center"><i class="fa-solid fa-heading"></i>2</button>
        <button @click="addBlock('header3')" title="heading 3" class="d-flex align-items-center justify-content-center"><i class="fa-solid fa-heading"></i>3</button>
        <button @click="addBlock('header4')" title="heading 4" class="d-flex align-items-center justify-content-center"><i class="fa-solid fa-heading"></i>4</button>
        <button @click="addBlock('quote')" title="quote block" class="d-flex align-items-center justify-content-center"><i class="fa-solid fa-quote-right"></i></button>
        <button @click="addBlock('code')" title="code block" class="d-flex align-items-center justify-content-center"><i class="fa-solid fa-code"></i></button>
        <button @click="addBlock('image')" title="image" class="d-flex align-items-center justify-content-center"><i class="fa-solid fa-image"></i></button>
        <button @click="addBlock('header-image')" title="Post header image" class="d-flex align-items-center justify-content-center"><i class="fa-solid fa-panorama"></i></button>
        <button @click="addBlock('tag')" title="Tag section" class="d-flex align-items-center justify-content-center"><i class="fa-solid fa-tag"></i></button>
        <button @click="addBlock('list')" title="list"><i class="fa-solid fa-list"></i></button>
        <button @click="addBlock('embedded')" title="embedded video (YT)"><i class="fa-solid fa-video"></i></button>
        <!-- <button @click="saveDocument" title="save" class="d-flex align-items-center justify-content-center"><i class="fa-solid fa-floppy-disk"></i></button> -->
    </div>

</template>

<script setup lang="ts">
import { ref, computed } from "vue"; 

const props = defineProps<{
    isOpen: boolean
}>(); 

const emits = defineEmits<{
    (event: 'addBlock', value: string) : void
    (event: 'showAddElement') : void
    (event: 'saveDocument') : void
}>(); 

const addElement = computed(() => props.isOpen)


const addBlock = (element: string) => {
    emits('addBlock', element);
}
const saveDocument = () => {
    emits('saveDocument');
}
</script>

<style scoped> 
.add-element { 
    position: relative; 
    cursor: pointer;
}
.add-element > .hr { 
    position: absolute; 
    top: 50%; 
    height: 2px; 
    width: 100%; 
    background: var(--color);
}

.add-element > i { 
    position: relative;
    padding: 0.5rem;
    background: var(--background-color);
    border-radius: 50%;
}

.editor { 
    margin-inline: auto;
    width: min-content;
    display: grid; 
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
    background: #f1f1f1; 
    border-radius: 5px;
    gap: 0.5rem;
    padding: 0.5rem;
    box-shadow: 4px 4px 14px 2px rgba(36, 36, 36, 0.5);
    /* border: 1px solid rgb(36, 36, 36) */
}

.editor > button { 
    width: 50px; 
    background: var(--background-color); 
    color: var(--color);
}

</style>