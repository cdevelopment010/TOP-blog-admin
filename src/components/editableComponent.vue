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
        ></div>

    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits, reactive, watch } from "vue";
  
  // Define the interface for the element
  interface element {
    id: number,
    html: string,
    children: element[],
    attributes: string,
    editing: boolean,
    hover: boolean
  }
  
  // Define props and emits
  const props = defineProps<{ data: element }>();
  const emit = defineEmits<{ (event: 'update', updatedHtml: string): void }>();
  
  // Reactive variable for editable text content
  const editableText = reactive({
    value: props.data.html, // Start with the original HTML
  });
  
  // Function to handle updates when the user edits the contenteditable div
  function updateContent(event: Event) {
    const inputEvent = event as InputEvent; // Cast to InputEvent
    const target = inputEvent.target as HTMLElement;
    editableText.value = target.innerHTML; // Update the reactive value with the new HTML
    emit('update', editableText.value); // Emit the updated HTML back to the parent
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