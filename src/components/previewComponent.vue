<template>
  <!-- Display the content editable div -->
  <div class="content">
    <div v-html="editableText.value" role="document"
      style="white-space: pre-wrap;min-width: 1px;">
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, onBeforeMount, onMounted, reactive, ref, watch } from "vue";

// Define the interface for the element
interface element {
  id: number,
  html: string,
  children: element[],
  attributes: string,
  editing: boolean,
  hover: boolean
}

const selectionRange = ref<Range | null>(null);
const isEditing = ref<boolean>(false);


// Define props and emits
const props = defineProps<{ data: element }>();
const emit = defineEmits<{
  (event: 'update', updatedHtml: string): void
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
}

function checkSelection() {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    selectionRange.value = selection.getRangeAt(0);
  } else {
    selectionRange.value = null;
  }
}

function preserveSelection() {
  // Restore the selection range when interacting with the popup
  const selection = window.getSelection();
  if (selection && selectionRange.value) {
    selection.removeAllRanges();
    selection.addRange(selectionRange.value);
  }
}


function handleBlur() {
  setTimeout(() => {
      isEditing.value = false;
  }, 250) //timeout to allow interacting with the toolbar. 
}
function applyStyle(style: string): void {
  if (!selectionRange.value) { return; }
  const span = document.createElement("span");
  span.style.fontWeight = style == 'bold' ? 'bold' : '';
  span.style.fontStyle = style == 'italic' ? 'italic' : '';
  span.appendChild(selectionRange.value.extractContents());
  selectionRange.value.insertNode(span);

  resetSelection();
}

function addLink() {
  if (!selectionRange.value) { return; }
  const url = prompt("Url..."); 
  if (!url) { return;}
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.appendChild(selectionRange.value.extractContents());
  selectionRange.value.insertNode(anchor);

  resetSelection();
}

function resetSelection() {
  selectionRange.value = null;
  const selection = window.getSelection();
  if (selection) { selection.removeAllRanges(); }
}



</script>

<style scoped>
.content {
  position: relative
}

.hover-el {
  position: absolute;
  left: 0rem;
  cursor: grab;
  padding: 10px;
}

.toolbar {
  display: flex;
  gap: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
  width: max-content;
  position: relative; 
}
.toolbar-item {
  padding: 5px;
}
.toolbar-border {
  border: 1px solid var(--color)}

.toolbar button {
  padding: 5px 10px;
  border: none;
  background-color: #0073aa;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}



.editable {
  padding: 10px;
}
</style>