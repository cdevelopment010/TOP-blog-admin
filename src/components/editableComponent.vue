<template>
    <!-- Display the content editable div -->
    <div class="content">
        <div class="hover-el" v-if="props.data.hover" @mouseenter="props.data.hover = true">
          <i class="fa-solid fa-grip-vertical me-2" ></i>
          <i class="fa-solid fa-link pointer" @click="$emit('addLink', props.data.id, startOffset || editableText.value.length)"></i>
        </div>
        <div 
            
            contenteditable="true" 
            v-html="editableText.value"
            @blur="updateContent"
            @mouseover="props.data.hover = true"
            @mouseleave="props.data.hover = false"
            @mouseup="checkSelection"
        ></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits, reactive, ref, watch } from "vue";
  
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
  const startOffset = ref<number | null>(null); 
  const endOffset  = ref<number | null>(); 
  const showModal = ref(false);
  const selectionRange = ref<Range | null>(null);

  // Define props and emits
  const props = defineProps<{ data: element }>();
  const emit = defineEmits<{ 
    (event: 'update', updatedHtml: string): void 
    (event: 'addLink', id: number, position: number):void
  }>();
  
  const editableText = reactive({
    value: props.data.html, 
  });
  
  watch(() => props.data.html, 
(newVal) => {
  editableText.value = newVal;
})
  
  function updateContent(event: Event) {
    
    const inputEvent = event as InputEvent; 
    const target = inputEvent.target as HTMLElement;
    editableText.value = target.innerHTML; 
    emit('update', editableText.value); 
    highlightText.value =""; 
    startOffset.value = null; 
    endOffset.value = null; 
  }

  function checkSelection() {
    const selection = window.getSelection(); 
    if (selection && selection.rangeCount > 0){
        const range = selection.getRangeAt(0);
        highlightText.value = selection.toString(); 
        startOffset.value = range.startOffset; 
        endOffset.value = range.endOffset; 
        selectionRange.value = range;
        showModal.value = highlightText.value != ""; 
      } else {
        highlightText.value =""; 
        startOffset.value = null; 
        endOffset.value = null; 
        selectionRange.value = null; 
        showModal.value = false; 
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