<template>
  <div class="container">
    <div class="nav-container">
        <NavComponent />
    </div>
    <div class="body-container">
      <!-- Main section -->
       <div>
         <template v-for="(el, index) in html" :key="el.id">
           <editableComponent :data="el" @update="updateHtml(index, $event)" @mouseover="el.hover = true" @mouseleave="el.hover = false"/>
         </template>
         <div class="add-section-container">
           <button @click.stop="togglePopup" class="add-section">
             <i class="fa-solid fa-circle-plus fa-2x"></i>
           
             <!-- popup for add section -->
             <!-- Maybe move to component -->
             <div 
               v-if="showPopup"
               class="popup-menu"
               ref="popupMenu"
             >
               <ul>
                 <li @click.stop="addSection('h2')">H2</li>
                 <li @click.stop="addSection('h2')">H3</li>
                 <li @click.stop="addSection('h3')">H4</li>
                 <li @click.stop="addSection('p')">Paragraph</li>
                 <li @click.stop="addSection('img')">Image</li>
                 <li @click.stop="addSection('code')">Code Block</li>
                 <li @click.stop="addSection('ad')">Ad</li>
               </ul>
             </div>
           </button>
             
         </div>

       </div>

    </div>
    
  </div>
  </template>
  
  
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import NavComponent from '../components/nav.vue';
import editableComponent from '../components/editableComponent.vue';  

  // Define the structure of a parsed element
  interface element { 
    id: number, 
    html: string, 
    children: element[]
    attributes: string,
    editing: boolean,
    hover: boolean,
  }

  const showPopup = ref<boolean>(false); 
  const popupMenu = ref<HTMLElement | null>(); 
  const html = ref<element[]>([
    {id: 0, html: "<h1>Awesome title!</h1>", children: [], attributes: "", editing: true, hover: false}
  ])
  watch(html, (newVal) => {
    console.log('HTML updated:', newVal);
  }, { deep: true });
  
  

  function updateHtml(index: number, updatedHtml: string) {
    console.log("UPDATE!");
    html.value[index] = { ...html.value[index], html: updatedHtml };
    console.log(html.value);
  }
  
  function addSection(type: string) { 
    if (['h2', 'h3', 'h4', 'p'].indexOf(type) > -1) {
      html.value.push({id: html.value.length, html: `<${type}><i>placeholder...</i></${type}>`, children: [], attributes: "", editing: true, hover: false})
    }
    if (type == 'img') {
      html.value.push({id: html.value.length, html: `<img src="" alt=""/>`, children: [], attributes: "", editing: true, hover: false})
    }
    
    if (type == 'code') {
      html.value.push({id: html.value.length, html: `<code>JS code</code>`, children: [], attributes: "", editing: true, hover: false})
    }
    if (type == 'ad') {
      console.error("Adding ads isn't supported yet")
    }
    showPopup.value = false;   
  }
  function togglePopup() {
    showPopup.value = !showPopup.value; 
  }
  
  /*
    - Drag sections
    - Highlight for popup menu
      - link
      - bold 
      - underline
      - italic
    - delete sections
  */

  function handleClickOutside(event: MouseEvent) {
    if (popupMenu.value && !popupMenu.value.contains(event.target as Node)){
      showPopup.value = false; 
    }
  }
  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
  })
</script>

<style scoped>
  .add-section-container, .add-section {position:relative;}

  .popup-menu {
    position: absolute; 
    top: 100%; 
    left: 0;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    padding: 8px 0;
    z-index: 1000;
  }
  .popup-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .popup-menu li {
    padding: 8px 16px;
    cursor: pointer;
  }

  .popup-menu li:hover {
    background-color: #f0f0f0;
  }
</style>