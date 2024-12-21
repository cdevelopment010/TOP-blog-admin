<template>
    <!-- Display the content editable div -->
    <div class="content">
        <i v-if="props.data.hover" class="fa-solid fa-grip-vertical hover-el" @mouseenter="props.data.hover = true"></i>
        <div 
            
            contenteditable="true" 
            v-html="editableText.value"
            @blur="updateContent"
            @mouseover="props.data.hover = true"
            @mouseleave="props.data.hover = false"
            @mouseup="checkSelection"
        ></div>
        <p v-if="highlightText">
            {{ highlightText }}
        </p>

    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits, reactive, ref } from "vue";
  
  // Define the interface for the element
  interface element {
    id: number,
    html: string,
    children: element[],
    attributes: string,
    editing: boolean,
    hover: boolean
  }
  
  const highlightText = ref<string>(""); 
  const startOffset = ref<number | null>(); 
  const endOffset  = ref<number | null>(); 
  // Define props and emits
  const props = defineProps<{ data: element }>();
  const emit = defineEmits<{ (event: 'update', updatedHtml: string): void }>();
  
  const editableText = reactive({
    value: props.data.html, 
  });
  
  
  function updateContent(event: Event) {
    highlightText.value =""; 
    startOffset.value = null; 
    endOffset.value = null; 
    const inputEvent = event as InputEvent; 
    const target = inputEvent.target as HTMLElement;
    editableText.value = target.innerHTML; 
    emit('update', editableText.value); 
  }

  function checkSelection() {
    const selection = window.getSelection(); 
    if (selection && selection.rangeCount > 0){
        const range = selection.getRangeAt(0);
        highlightText.value = selection.toString(); 
        startOffset.value = range.startOffset; 
        endOffset.value = range.endOffset; 
    } else {
        highlightText.value =""; 
        startOffset.value = null; 
        endOffset.value = null; 
    }
  }
  </script>
  
<style scoped>
    .content {position: relative}
    .hover-el { 
        position: absolute;
        left: 0rem;
        cursor:grab; 
        padding:10px; }
</style>