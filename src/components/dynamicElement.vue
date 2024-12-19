<template>
    <div>
      <component
        v-if="element.tag"
        :is="element.tag"
        v-bind="element.attributes"
        @dblclick="enableEditing"
      >
        <!-- Render direct text content -->
        <template v-if="element.content && !isEditing">{{ element.content }}</template>
        <textarea
          v-else-if="isEditing"
          v-model="element.content"
          @blur="disableEditing"
        />
  
        <!-- Render children recursively -->
        <div v-for="(child, index) in element.children" :key="index">
          <DynamicElement :element="child" />
        </div>
      </component>
  
      <!-- Render text nodes directly -->
      <span v-else>{{ element.content }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  // Define props
  interface ParsedElement {
    tag: string;
    attributes: Record<string, string>;
    content: string | null;
    children: ParsedElement[];
  }
  
  const props = defineProps<{ element: ParsedElement }>();
  
  // Local state for editing
  const isEditing = ref(false);
  
  const enableEditing = () => {
    isEditing.value = true;
  };
  
  const disableEditing = () => {
    isEditing.value = false;
  };
  </script>
  