<template>
  <div class="container">
    <div class="nav-container">
      <NavComponent />
    </div>
    <div class="body-container post-grid">
      <!-- Main section -->
      <div class="create-post-section">
        <template v-for="(el, index) in html" :key="el.id">
          <editableComponent :data="el" 
            @update="updateHtml(index, $event)" 
            @setDeleted="deleteSection"
            @moveUp="moveUp(index)"
            @moveDown="moveDown(index)"
            />
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
                <li @click.stop="addSection('header-img')">Header Image</li>
                <li @click.stop="addSection('code')">Code Block</li>
                <li @click.stop="addSection('ad')">Ad</li>
                <li @click.stop="addSection('affiliate')">Affiliate Warning</li>
                <li @click.stop="addSection('tags')">Tags</li>
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

  <Modal :show="showModal" @close="showModal = false">
        <template #header>
            <h3>Upload / Select images</h3>
        </template>
        <template #default>
            <div>
              <ExisitingImages @select-image="updateImageUrl"/>
              <UploadingImage @upload-image="updateImageUrl"/>
            </div>
        </template>
        <template #footer>
            <div class="mt-2">
                <button @click="submitImage" class="me-2">Submit</button>
                <button @click="showModal = false">Cancel</button>
            </div>
        </template>
    </Modal>

    <Toast />
</template>


<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import NavComponent from '../components/nav.vue';
import editableComponent from '../components/editableComponent.vue';
import PostSettings from '../components/postSettings.vue';
import Modal from '../components/modal.vue';
import { currentUser } from '../utils/auth'; 
import ExisitingImages from '../components/exisitingImages.vue';
import UploadingImage from '../components/uploadingImage.vue';
import { useToast } from '../utils/useToast';
import Toasts from '../components/Toasts.vue';

const route = useRoute();
const { addToast } = useToast(); 

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

const adsbygoogle = window.adsbygoogle || [];

type JsonValue = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue}
  | JsonValue[];

interface element {
  id: number,
  html: string,
  children: element[]
  attributes: string,
  editing: boolean,
  hover: boolean,
  deleted?: boolean
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
  content: JsonValue ,
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

const showModal = ref(); 
const imageUrl = ref<string | null>(); 
const headerImg = ref<boolean>(false);
const createPost = ref<boolean>(true);
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

let isDeleting = false;

function deleteSection(id: number) {
  isDeleting = true; // Disable updateHtml temporarily
  html.value = html.value.filter((section) => section.id !== id);
  setTimeout(() => (isDeleting = false), 0); // Re-enable after deletion
}
function updateHtml(index: number, updatedHtml: string) {
  if (isDeleting || isMoving) return;
  html.value[index] = { ...html.value[index], html: updatedHtml };  
}
 function updatePostSettings(updatedPostSettings: PostSettings) {
  postSettings.value = updatedPostSettings;
  generateTags(); 
}
let isMoving = false; 
function moveUp(index: number) { 
  isMoving = true; 
  if (index <= 1) { return }
  [html.value[index-1], html.value[index]] = [html.value[index], html.value[index-1]];
  setTimeout(() => {isMoving = false}, 0);

}

function moveDown(index: number) { 
  isMoving = true; 
  if (index >= html.value.length) { return }
  [html.value[index], html.value[index+1]] = [html.value[index+1], html.value[index]];
  setTimeout(() => {isMoving = false}, 0);

}

async function getPostById() {
  let url = 'https://top-blog-api-proud-thunder-6960.fly.dev/post/'
  if (route.params.id) { 
    url = `https://top-blog-api-proud-thunder-6960.fly.dev/post/${route.params.id}`
  }
  await fetch(url, {
            mode: 'cors',
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json', 
                'authorization': `bearer: ${localStorage.getItem('jwt')}` 
            }
        })
        .then(async response => {
            if(!response.ok) {
                const data = await response.json(); 
                throw new Error(data.message)
            } else { 
              const data = await response.json(); 
              console.log("update post:",data.data.content)
              html.value = JSON.parse(data.data.content);

              postSettings.value.description = data.data.metaDescription;
              postSettings.value.keywords = data.data.metaKeywords; 
              postSettings.value.slug = data.data.slug;

              //fix - data.data doesn't contain tags. 
            }
        })
        .catch(err => {
            console.error(err); 
        })
}

async function save(updatedPostSettings: PostSettings) {
  const post = setupPost();
  // console.log(route.params.id ,createPost, post); 
  let url = 'https://top-blog-api-proud-thunder-6960.fly.dev/post/'; 
  let method = 'POST'; 
  if (!createPost.value) {
    url = `https://top-blog-api-proud-thunder-6960.fly.dev/post/${route.params.id}`;
    // url = `http://localhost:3000/post/${route.params.id}`;
    method = 'PUT';
  }
  // await fetch('http://localhost:3000/post/', {
  await fetch(url, {
            mode: 'cors',
            method: method,
            headers: { 
                'Content-Type': 'application/json', 
                'authorization': `bearer: ${localStorage.getItem('jwt')}` 
            },
            body: JSON.stringify({post: post, currentUser: currentUser.value})
        })
        .then(async response => {
            if(!response.ok) {
                const data = await response.json(); 
                addToast({ title: 'Error!', message: 'There was an error saving the post.', type: 'danger', timeout: 3000})
                throw new Error(data.message)
            } else { 
              const data = response.json(); 
              console.log("success", data); 
              addToast({ title: 'Success', message: 'Post was saved', type: 'success', timeout: 3000})
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
function generateTags() : void { 
  let tagSection = document.getElementById('tag-section'); 
  if (tagSection) { 
    tagSection.innerHTML = ""; 
    postSettings.value.tags?.forEach(tag => {
      let t = document.createElement('div'); 
      t.classList.add('pill')
      t.classList.add('me-2')
      t.innerText = tag.name; 
      tagSection.appendChild(t);
      console.log(t);
    })
  } else { 
    console.warn("no tag section")
    return; 
  }
}

function addSection(type: string) {
  if (['h2', 'h3', 'h4', 'p'].indexOf(type) > -1) {
    html.value.push({ id: html.value.length, html: `<${type}><i>placeholder...</i></${type}>`, children: [], attributes: "", editing: true, hover: false })
  }
  if (type == 'img') {
    headerImg.value = false;
    showModal.value = true; 
  }
  if (type == 'header-img') {
    headerImg.value = true;
    showModal.value = true; 
  }
  if (type == 'affiliate') {
    html.value.push({id: html.value.length, html: `<section><i>Disclosure: This post may contain affiliate links, meaning I get a commission if you decide to make a purchase through my links, at no cost to you.</i></section>`, children: [], attributes: "", editing: false, hover: false})
  }

  if (type == 'tags') {
    html.value.push({ id: html.value.length, html: `<section id='tag-section' class='d-flex align-items-center justify-content-center'></section>`, children: [], attributes: "", editing: false, hover: false })
    setTimeout(() => {
      generateTags();
    }, 250);  
  }
  if (type == 'code') {
    let lang = prompt("Which language is the code?"); 
    if (!lang) {
      console.error("No language added"); 
      return; 
    }

    html.value.push({ id: html.value.length, html: `<pre><code>code</code></pre>`, children: [], attributes: "", editing: true, hover: false })
  }
  if (type == 'ad') {
    console.error("Adding ads isn't supported yet")
      const adHtml = `<div align="center" class="ads"></div>`;
    html.value.push({
      id: html.value.length,
      html: adHtml,
      children: [],
      attributes: "",
      editing: false,
      hover: false
    });
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
    content: JSON.stringify(html.value),
    numberOfView: 0,
    numberOfShares: 0,
    published: false,
    comment: [],
    tagId: postSettings.value.tags, //this should be an array. Update Prisma schema. 
    slug: postSettings.value.slug as string, //Add to Prisma
    metaDescription: postSettings.value.description as string, //Add to Prisma
    metaKeywords: postSettings.value.keywords as string, //Add to Prisma
  }
  if (typeof route.params.id === 'string') { 
    post.id = parseInt(route.params.id); 
  }
  return post; 
}

function handleClickOutside(event: MouseEvent) {
  if (popupMenu.value && !popupMenu.value.contains(event.target as Node)) {
    showPopup.value = false;
  }
}

function updateImageUrl(url : string | null) : void { 
  imageUrl.value = url; 
  console.log("Image URL", imageUrl.value);
}

function submitImage(): void { 
  let htmlStr = `<img src="${imageUrl.value}" alt=""/>`
  if (headerImg.value) { 
    htmlStr = `<img src="${imageUrl.value}" class="header-img" alt=""/>`
  }
  html.value.push({ id: html.value.length, html: htmlStr, children: [], attributes: "", editing: true, hover: false }); 
  showModal.value = false; 
}


onMounted(async () => {
  if (route.params.id) {
    createPost.value = false; 
    await getPostById(); 
  }
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