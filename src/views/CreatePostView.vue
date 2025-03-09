<template>
  <div class="container">
    <div class="nav-container">
      <NavComponent />
    </div>
    <div class="body-container post-grid">
      <!-- Main section -->
      <div class="create-post-section">
        
        <AddElement v-if="documentModel.length == 0"  @add-block="addBlock" @save-document="saveDocument" @show-add-element="showAddElement = !showAddElement"/>
        <div v-for="(block, index) in documentModel" :key="block.id" >
          <div v-if="showToolbar && selectedBlock == block.id" class="d-flex">
            <button @click="moveUp(block.id)">Up</button>
            <button @click="moveDown(block.id)">Down</button>
            <toolbar  @apply-formatting="applyFormatting"/>
          </div>
          <h2 @click="selectBlock(block.id)" 
              @focus="storeSelection"
              v-if="block.type === 'header'" 
              contenteditable 
              @blur="updateContent(block.id)"
              v-html="block.content"
              :data-id="block.id">
          </h2>


          <p @click="selectBlock(block.id)" 
            @focus="() => {storeSelection(); showToolbar = true;}"
            v-else-if="block.type === 'paragraph'"
            contenteditable 
            @blur="(e) => { handleBlur(); updateContent(block.id) }"
            v-html="block.content"
            :data-id="block.id">
          </p>

          <blockquote 
            @click="selectBlock(block.id)" 
            @focus="storeSelection"
            v-else-if="block.type === 'quote'" 
            contenteditable 
            @blur="updateContent(block.id)"
            v-html="block.content"
            >
          </blockquote>

          <pre 
            @click="selectBlock(block.id)" 
            v-else-if="block.type === 'code'"
            >
            <code contenteditable 
              @input="updateContent(block.id)"
              @focus="storeSelection"
              >
              {{ block.content }}
              </code>
          </pre>
          <a 
            @click="selectBlock(block.id)" 
            @focus="storeSelection"
            v-else-if="block.type === 'link'" 
            :href="block.url"
            target="_blank"
            v-html="block.content"
            >
          </a>

          <AddElement v-if="showToolbar && selectedBlock == block.id" @add-block="addBlock" @save-document="saveDocument" @show-add-element="showAddElement = !showAddElement"/>
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

    <Toasts />
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import NavComponent from '../components/nav.vue';
import PostSettings from '../components/postSettings.vue';
import Modal from '../components/modal.vue';
import { currentUser } from '../utils/auth'; 
import ExisitingImages from '../components/exisitingImages.vue';
import UploadingImage from '../components/uploadingImage.vue';
import { useToast } from '../utils/useToast';
import Toasts from '../components/Toasts.vue';
import toolbar from '../components/toolbar.vue';
import AddElement from '../components/addElement.vue';

const route = useRoute();
const { addToast } = useToast(); 

declare global {
  interface Window {
    adsbygoogle: any;
  }
}


type JsonValue = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue}
  | JsonValue[];

interface element {
  id: number;
  type: string;
  level?: number;
  content: string;
  language?: string;
  url?: string;
  children?: element[];
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
const showToolbar = ref<boolean>(false); 
const showAddElement = ref<boolean>(false); 
const imageUrl = ref<string | null>(); 
const headerImg = ref<boolean>(false);
const createPost = ref<boolean>(true);
const showPopup = ref<boolean>(false);
const popupMenu = ref<HTMLElement | null>();
const documentModel = ref<element[]>([]); 
const selectedBlock = ref<number | null>(null); 
const toolbarAction = ref<number | null>(null);
const linkInput = ref(""); 
let lastSelection: Range | null = null;

const saveDocument = () => {
  console.log("document", documentModel.value)
}

const postSettings = ref<PostSettings>({
  id: null,
  slug: '',
  description: '',
  tags: [],
  keywords: ''
});

const storeSelection = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    lastSelection = selection.getRangeAt(0);
  }
};

const restoreSelection = () => {
  console.log("lastSelection", lastSelection);
  if (lastSelection) {
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(lastSelection);
  }
};

const handleBlur = () => {
  storeSelection(); 
  setTimeout(() => {
    if (!showAddElement.value) { 
      showToolbar.value = false; 
    }
  }, 250)
}
const updateContent = (id: number) => {
  const block = documentModel.value.find(b => b.id === id);
  if (!block) return;

  const element = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
  if (element) {
    block.content = element.innerHTML; // Preserve formatting properly
  }
};

const addBlock = (type: string) => { 
  documentModel.value.push({
    id: documentModel.value.length, 
    type, 
    content: type === "code" ? "console.log('New code block');" : "New " + type
  })
}

const applyFormatting = (action: string, url?: string) => {
  console.log(action, url); 
  debugger; 
  restoreSelection(); // Ensure the correct selection is active
  if (selectedBlock.value == null || !lastSelection) return;
  
  let block = documentModel.value.find(b => b.id === selectedBlock.value);
  if (!block) return;

  const selectedText = lastSelection.toString();
  if (!selectedText) return;

  let formattedText = selectedText;

  if (action === "bold") {
    formattedText = `<b>${selectedText}</b>`;
  } else if (action === "italic") {
    formattedText = `<i>${selectedText}</i>`;
  } else if (action === "highlight") {
    formattedText = `<mark>${selectedText}</mark>`;
  } else if (action === "link") {
    formattedText = `<a href="${url}" target="_blank">${selectedText}</a>`;
  }

  // Replace the selected text with formatted text
  lastSelection.deleteContents();
  const newNode = document.createElement("span");
  newNode.innerHTML = formattedText;
  lastSelection.insertNode(newNode);

  // ✅ Ensure `documentModel` gets updated with new formatted content
  const element = document.querySelector(`[data-id="${block.id}"]`) as HTMLElement;
  if (element) {
    block.content = element.innerHTML;
  }
};

const selectBlock = (id: number) => {
  selectedBlock.value = id;
};

function updatePostSettings(updatedPostSettings: PostSettings) {
  postSettings.value = updatedPostSettings;
  generateTags(); 
}
let isMoving = false; 
function moveUp(index: number) { 
  isMoving = true; 
  console.log(index, index-1)
  if (index <= 0) { return }
  [documentModel.value[index-1], documentModel.value[index]] = [documentModel.value[index], documentModel.value[index-1]];
  const tempId = documentModel.value[index].id;
  documentModel.value[index].id = documentModel.value[index - 1].id;
  documentModel.value[index - 1].id = tempId;
  setTimeout(() => {isMoving = false}, 0);

}

function moveDown(index: number) { 
  isMoving = true; 
  console.log(index, index+1)
  if (index >= documentModel.value.length - 1) { return }
  [documentModel.value[index], documentModel.value[index+1]] = [documentModel.value[index+1], documentModel.value[index]];
  const tempId = documentModel.value[index].id;
  documentModel.value[index].id = documentModel.value[index + 1].id;
  documentModel.value[index + 1].id = tempId;
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
              documentModel.value = JSON.parse(data.data.content);

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

// function addSection(type: string) {
//   if (['h2', 'h3', 'h4', 'p'].indexOf(type) > -1) {
//     html.value.push({ id: html.value.length, html: `<${type}><i>placeholder...</i></${type}>`, children: [], attributes: "", editing: true, hover: false })
//   }
//   if (type == 'img') {
//     headerImg.value = false;
//     showModal.value = true; 
//   }
//   if (type == 'header-img') {
//     headerImg.value = true;
//     showModal.value = true; 
//   }
//   if (type == 'affiliate') {
//     html.value.push({id: html.value.length, html: `<section><i>Disclosure: This post may contain affiliate links, meaning I get a commission if you decide to make a purchase through my links, at no cost to you.</i></section>`, children: [], attributes: "", editing: false, hover: false})
//   }

//   if (type == 'tags') {
//     html.value.push({ id: html.value.length, html: `<section id='tag-section' class='d-flex align-items-center justify-content-center'></section>`, children: [], attributes: "", editing: false, hover: false })
//     setTimeout(() => {
//       generateTags();
//     }, 250);  
//   }
//   if (type == 'code') {
//     let lang = prompt("Which language is the code?"); 
//     if (!lang) {
//       console.error("No language added"); 
//       return; 
//     }

//     html.value.push({ id: html.value.length, html: `<pre><code>code</code></pre>`, children: [], attributes: "", editing: true, hover: false })
//   }
//   if (type == 'ad') {
//     console.error("Adding ads isn't supported yet")
//       const adHtml = `<div align="center" class="ads"></div>`;
//     html.value.push({
//       id: html.value.length,
//       html: adHtml,
//       children: [],
//       attributes: "",
//       editing: false,
//       hover: false
//     });
//   }
//   showPopup.value = false;
// }
// function togglePopup() {
//   showPopup.value = !showPopup.value;
// }

function setupPost(): Post {
  const titleDom = new DOMParser(); 
  const title = titleDom.parseFromString(documentModel.value[0].content, "text/html").body.textContent;

  const post: Post = { 
    title: title,
    content: JSON.stringify(documentModel.value),
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
  documentModel.value.push({ id: documentModel.value.length, content: htmlStr, type: 'image'}); 
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


.editor {
  max-width: 600px;
  margin: auto;
  font-family: sans-serif;
}
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
button {
  cursor: pointer;
  padding: 5px;
  margin: 3px;
}
[contenteditable] {
  outline: none;
  border: 1px solid lightgray;
  padding: 4px;
  margin: 4px 0;
}



</style>