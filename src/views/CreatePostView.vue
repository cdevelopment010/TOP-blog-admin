<template>
  <div class="container">
    <div class="nav-container">
      <NavComponent />
    </div>
    <div class="body-container post-grid">
      <!-- Main section -->
      <div class="create-post-section">
        <template v-for="(el, index) in html" :key="el.id">
          <editableComponent :data="el" @update="updateHtml(index, $event)"/>
        </template>
        <div class="add-section-container">
          <button @click.stop="togglePopup" class="add-section">
            <i class="fa-solid fa-circle-plus fa-2x"></i>

            <!-- popup for add section -->
            <!-- Maybe move to component -->
            <div v-if="showPopup" class="popup-menu" ref="popupMenu">
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

      <!-- Post settings section -->
      <div class="border-left">
        <PostSettings :postSettings="postSettings" @update="updatePostSettings($event)" @save="save($event)"
          @saveAndPublish="saveAndPublish($event)" />
      </div>
    </div>

  </div>
</template>


<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, reactive } from 'vue';
import NavComponent from '../components/nav.vue';
import editableComponent from '../components/editableComponent.vue';
import PostSettings from '../components/postSettings.vue';

import { currentUser } from '../utils/auth'

interface element {
  id: number,
  html: string,
  children: element[]
  attributes: string,
  editing: boolean,
  hover: boolean,
}

interface PostSettings {
  id?: number | null,
  slug?: string | null,
  tags?: {id: number, name: string}[] | null,
  description?: string | null,
  keywords?: string | null
}

interface Post {
  id?: number,
  title: string | null,
  content: string,
  numberOfView: number,
  numberOfShares: number,
  published: boolean,
  publishedAt?: Date,
  publishedById?: number,
  createdAt?: Date,
  createdById?: number,
  updatedAt?: Date,
  updatedById?: number,
  comment: [],
  tagId: {id: number, name: string}[] | null | undefined, //this should be an array. Update Prisma schema. 
  slug: string, //Add to Prisma
  metaDescription: string, //Add to Prisma
  metaKeywords: string, //Add to Prisma
}


const showPopup = ref<boolean>(false);
const popupMenu = ref<HTMLElement | null>();
const html = ref<element[]>([
  { id: 0, html: "<h1>Awesome title!</h1>", children: [], attributes: "", editing: true, hover: false }
])
const postSettings = ref<PostSettings>({
  id: null,
  slug: '',
  description: '',
  tags: [],
  keywords: ''
});
watch(html, (newVal) => {
}, { deep: true });


function updateHtml(index: number, updatedHtml: string) {
  html.value[index] = { ...html.value[index], html: updatedHtml };
}
 function updatePostSettings(updatedPostSettings: PostSettings) {
  postSettings.value = updatedPostSettings;
  
}

async function save(updatedPostSettings: PostSettings) {
  const post = setupPost();
  console.log(post); 
  // await fetch('http://localhost:3000/post/', {
  await fetch('https://top-blog-api-production.up.railway.app/post/', {
            mode: 'cors',
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'authorization': `bearer: ${localStorage.getItem('jwt')}` 
            },
            body: JSON.stringify({post: post, currentUser: currentUser.value})
        })
        .then(async response => {
            if(!response.ok) {
                const data = await response.json(); 
                throw new Error(data.message)
            }
        })
        .catch(err => {
            console.error(err); 
        })
}

function saveAndPublish(updatedPostSettings: PostSettings) {
  
  const post = setupPost(); 
  post.published = true, 
  post.publishedAt = new Date(); 
}

function addSection(type: string) {
  if (['h2', 'h3', 'h4', 'p'].indexOf(type) > -1) {
    html.value.push({ id: html.value.length, html: `<${type}><i>placeholder...</i></${type}>`, children: [], attributes: "", editing: true, hover: false })
  }
  if (type == 'img') {
    html.value.push({ id: html.value.length, html: `<img src="" alt=""/>`, children: [], attributes: "", editing: true, hover: false })
  }

  if (type == 'code') {
    html.value.push({ id: html.value.length, html: `<code>JS code</code>`, children: [], attributes: "", editing: true, hover: false })
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
    - underline
  - delete sections
*/

function setupPost(): Post {
  const titleDom = new DOMParser(); 
  const title = titleDom.parseFromString(html.value[0].html, "text/html").body.textContent;

  const post: Post = { 
    title: title,
    content: html.value.reduce((content,x) => {return content += x.html}, ''),
    numberOfView: 0,
    numberOfShares: 0,
    published: false,
    comment: [],
    tagId: postSettings.value.tags, //this should be an array. Update Prisma schema. 
    slug: postSettings.value.slug as string, //Add to Prisma
    metaDescription: postSettings.value.description as string, //Add to Prisma
    metaKeywords: postSettings.value.keywords as string, //Add to Prisma
  }
  return post; 
}

function handleClickOutside(event: MouseEvent) {
  if (popupMenu.value && !popupMenu.value.contains(event.target as Node)) {
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
.post-grid {
  display: grid;
  grid-template-columns: 8fr 2fr;
}

.create-post-section {
  width: 80%;
  margin-inline: auto;
}

.border-left {
  border-left: 1px solid var(--color)
}

.add-section-container,
.add-section {
  position: relative;
}


</style>