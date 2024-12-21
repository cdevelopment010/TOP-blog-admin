<template>
  <div class="container">
    <div class="nav-container">
        <NavComponent />
    </div>
    <div class="body-container">
      <template v-for="(el, index) in html" :key="el.id">
        <editableComponent :data="el" @update="updateHtml(index, $event)" />
      </template>
      <button @click="addSection">Add section</button>
    </div>
  </div>
  </template>
  
  
<script setup lang="ts">
import { ref, watch } from 'vue';
import NavComponent from '../components/nav.vue';
import editableComponent from '../components/editableComponent.vue';  

  // Define the structure of a parsed element
  interface element { 
    id: number, 
    html: string, 
    children: element[]
    attributes: string,
    editing: boolean,
  }

  const html = ref<element[]>([
    {id: 0, html: "<h1>Awesome title!</h1>", children: [], attributes: "", editing: true}
  ])
  watch(html, (newVal) => {
    console.log('HTML updated:', newVal);
  }, { deep: true });
  
  

  function updateHtml(index: number, updatedHtml: string) {
    console.log("UPDATE!");
    html.value[index] = { ...html.value[index], html: updatedHtml };
    console.log(html.value);
  }
  
  function addSection() { 
    html.value.push({id: html.value.length, html: "<section><i>placeholder...</i></section>", children: [], attributes: "", editing: true})
    console.log(html.value);
  
  }
  
  /*
    - Drag sections
    - Add different sections
      - P
      - Code
      - Images
      - Ads? 
    - Highlight for popup menu
      - link
      - bold 
      - underline
      - italic
    - delete sections
  */
</script>
