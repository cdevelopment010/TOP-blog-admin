<template>
  <div class="container">
    <div class="nav-container">
      <NavComponent />
    </div>
    <div class="body-container post-grid">
      <!-- Main section -->
      <div class="create-post-section">
        
        <AddElement v-if="documentModel.length == 0" :is-open="showAddElement" @add-block="addBlock" @show-add-element="showAddElement = !showAddElement"/>
        <div v-for="(block, index) in documentModel" :key="block.id" >
          <div v-if="showToolbar && selectedBlock == block.id" class="d-flex toolbar">
            <div class="toolbar-border toolbar-item"> 
              <span style="padding: 0.5rem;" @click="moveUp(block.id)"><i class="fa-solid fa-caret-up pointer"></i></span>
              <span style="padding: 0.5rem;" @click="moveDown(block.id)"><i class="fa-solid fa-caret-down pointer"></i></span>
            </div>
            <div class="toolbar-border toolbar-item">
              <toolbar  @apply-formatting="applyFormatting"/>
            </div>
            <div class="toolbar-border toolbar-item"> 
              <span @click="deleteSection(block.id)"><i class="fa-solid fa-trash pointer color-danger"></i></span>
            </div>
          </div>
          <h1 @click="selectBlock(block.id)" 
              @focus="() => {storeSelection(); showToolbar = true;}"
              @mouseup="storeSelection"
              v-if="block.type === 'header1'" 
              contenteditable 
              @blur="(e) => { handleBlur(); updateContent(block.id)}"
              v-html="block.content"
              :data-id="block.id">
          </h1>
          <h2 @click="selectBlock(block.id)" 
              @focus="() => {storeSelection(); showToolbar = true;}"
              @mouseup="storeSelection"
              v-if="block.type === 'header2'" 
              contenteditable 
              @blur="updateContent(block.id)"
              v-html="block.content"
              :data-id="block.id">
          </h2>
          <h3 @click="selectBlock(block.id)" 
              @focus="() => {storeSelection(); showToolbar = true;}"
              @mouseup="storeSelection"
              v-if="block.type === 'header3'" 
              contenteditable 
              @blur="updateContent(block.id)"
              v-html="block.content"
              :data-id="block.id">
          </h3>
          <h4 @click="selectBlock(block.id)" 
              @focus="() => {storeSelection(); showToolbar = true;}"
              @mouseup="storeSelection"
              v-if="block.type === 'header4'" 
              contenteditable 
              @blur="updateContent(block.id)"
              v-html="block.content"
              :data-id="block.id">
          </h4>

          <div
            @click="selectBlock(block.id)" 
            v-else-if="block.type == 'tag'"
            v-html="block.content"
            :data-id="block.id"
          > 

          </div>


          <p @click="selectBlock(block.id)" 
            @focus="() => {storeSelection(); showToolbar = true;}"
            v-else-if="block.type === 'paragraph'"
            contenteditable 
            @blur="(e) => { handleBlur(); updateContent(block.id) }"
            v-html="block.content"
            :data-id="block.id">
          </p>

          <ul
            v-else-if="block.type === 'list'"
            @click="selectBlock(block.id)"
            :data-id="block.id"
          >
            <template v-for="(child, index) in block.children" :key="block.id + '-' + index">
                <li 
                contenteditable 
                @keydown.enter.prevent="addListItem(block.id, index)"
                @keydown.backspace = "handleBackspaceListItem(block.id, index, $event)"
                @focus="() => {storeSelection(); showToolbar = true;}"
                @blur="(e) => { updateListItem(block.id, index, e)}"
                v-html="child"
                >
              </li>
              <!-- <div class="d-flex">
                <li 
                contenteditable 
                @keydown.enter.prevent="addListItem(block.id, index)"
                @focus="() => {storeSelection(); showToolbar = true;}"
                @blur="(e) => { updateListItem(block.id, index, e)}"
                v-html="child"
                >
              </li>
              <button @click="deleteListItem(block.id, index)">DELETE</button>
              </div> -->
            </template>
          </ul>

          <blockquote 
            @click="selectBlock(block.id)" 
            @focus="() => {storeSelection(); showToolbar = true;}"
            v-else-if="block.type === 'quote'" 
            contenteditable 
            @blur="updateContent(block.id)"
            v-html="block.content"
            >
          </blockquote>

          <div v-else-if="block.type === 'code'">
            <select v-model="block.language">
              <option value="">--None--</option>
              <option value="css">CSS</option>
              <option value="html">HTML</option>
              <option value="js">JS</option>
              <option value="sql">SQL</option>
              <option value="csharp">C#</option>

            </select>
            <pre 
              @click="selectBlock(block.id)" 
              >
              <code contenteditable 
                @blur="updateContent(block.id)"
                @focus="() => {storeSelection(); showToolbar = true;}"
                :data-id="block.id"
                v-html="block.content"></code>
            </pre>
          </div>
          <a 
            @click="selectBlock(block.id)" 
            @focus="storeSelection"
            v-else-if="block.type === 'link'" 
            :href="block.url"
            target="_blank"
            v-html="block.content"
            >
          </a>

          <div 
            @click="selectBlock(block.id)" 
            @focus="() => {storeSelection(); showToolbar = true;}"
            @blur="updateContent(block.id)"
            v-else-if="block.type == 'image'"
            class="image-container"
            contenteditable
            v-html="block.content"
            :data-id="block.id"
            > 
          </div>

          <AddElement v-if="showToolbar && selectedBlock == block.id" :is-open="showAddElement" @add-block="addBlock" @show-add-element="showAddElement = !showAddElement"/>
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
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
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
  children?: any[];
}

interface PostSettings {
  id?: number | null,
  slug?: string | null,
  tags?: {id: number, name: string}[] | null,
  description?: string | null,
  keywords?: string | null,
  title?: string | null,
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
let lastSelection = ref<Range | null>(null);

const postSettings = ref<PostSettings>({
  id: null,
  slug: '',
  description: '',
  tags: [],
  keywords: '',
  title: ''
});

const storeSelection = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    lastSelection.value = selection.getRangeAt(0);
  } else { 
    lastSelection.value = null; 
  }
};

const resetSelection = () => {
  lastSelection.value = null; 
  const selection = window.getSelection(); 
  if (selection) { selection.removeAllRanges(); }
}

const handleBlur = () => {
  storeSelection(); 
  setTimeout(() => {
    if (!showAddElement.value) { 
      showToolbar.value = false; 
      console.log("toolbar:", showToolbar.value);
    }
  }, 250)
}
const updateContent = (id: number) => {
  const block = documentModel.value.find(b => b.id === id);
  if (!block) return;

  console.log(block);
  const element = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
  if (element) {
    block.content = element.innerHTML; // Preserve formatting properly
  }
};

const addBlock = (type: string) => { 
  showAddElement.value = false;
  if (type == 'header-image') {
    headerImg.value = true; 
    showModal.value = true; 
    return;
  }
  if (type == 'image') { 
    showModal.value = true; 
    return;
  }

  if (type == 'tag') { 
    documentModel.value.push({
      id: documentModel.value.length, 
      type, 
      content: `<section id='tag-section' class='d-flex align-items-center justify-content-center'>Tags</section>`
    })
    return; 
  }

  if (type == 'list') { 
    documentModel.value.push({
      id: documentModel.value.length, 
      type, 
      content: '',
      children: ['List Item 1']
    })
    return; 
  }
  documentModel.value.push({
    id: documentModel.value.length, 
    type, 
    content: type === "code" ? "console.log('New code block');" : "New " + type
  })

  
}

const applyFormatting = (action: string, url?: string) => {
  if (selectedBlock.value == null || !lastSelection.value) return;
  
  let block = documentModel.value.find(b => b.id === selectedBlock.value);
  if (!block) return;

  const selectedText = lastSelection.value.toString()
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

  lastSelection.value.deleteContents();
  const newNode = document.createElement("span");
  newNode.innerHTML = formattedText;
  lastSelection.value.insertNode(newNode);

  const element = document.querySelector(`[data-id="${block.id}"]`) as HTMLElement;
  if (element) {
    block.content = element.innerHTML;
  }
  resetSelection(); 
};

const selectBlock = (id: number) => {
  selectedBlock.value = id;
};

const addListItem = (blockId: number, index: number) => {
  const block = documentModel.value.find(b => b.id === blockId); 
  if (!block) { return }

  block.children?.splice(index + 1, 0, ''); 
  nextTick(() => {
    const ul = document.querySelector(`[data-id="${blockId}"]`);
    const li = ul?.children[index+1] as HTMLElement;
    li?.focus();  
  })
}

const deleteListItem = (blockId: number, index: number) => { 
  const block = documentModel.value.find(b => b.id === blockId); 
  if (!block) { return }

  if (!block.children) { return }

  let newBlockChidlren = [...block.children];
  newBlockChidlren.splice(index, 1); 

  block.children = newBlockChidlren;
}

const handleBackspaceListItem = (blockId: number, index: number, e: KeyboardEvent) => {
  const block = documentModel.value.find(b => b.id === blockId);
  if (!block?.children) return;

  const li = e.target as HTMLElement;
  const text = li.innerText.trim();
  const html = li.innerHTML.trim();
  const isEmpty = text === '' || html === '<br>';

  if (!isEmpty) return;

  // Don't delete if there's only one item, just clear it
  if (block.children.length === 1) {
    e.preventDefault();
    block.children = [''];
    li.innerHTML = ''; // clear the visual content
    return;
  }

  // Prevent default and delete the item
  e.preventDefault();
  const updated = [...block.children];
  updated.splice(index, 1);
  block.children = updated;

  setTimeout(() => {
    const ul = document.querySelector(`[data-id="${blockId}"]`);
    const prevLi = ul?.children[Math.max(0, index - 1)] as HTMLElement;
    prevLi?.focus();
    console.log("backspace", block.children)
  },0)
};

const updateListItem = async (blockId: number, index: number, e : Event) => {
  setTimeout(() => {
    const block = documentModel.value.find(b => b.id === blockId); 
    if (!block || !block.children) { return }
    const li = e.target as HTMLElement;
    const html = li.innerHTML.trim();
    if (html === '<br>' || html === '') { return; }

    const updatedChildren = [...block.children];
    updatedChildren[index] = html === '<br>' ? '' : html;

    block.children = updatedChildren;
  }, 100)

}

function updatePostSettings(updatedPostSettings: PostSettings) {
  postSettings.value = updatedPostSettings;
  console.log(postSettings.value);
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

function deleteSection(id: number) { 
  documentModel.value = documentModel.value.filter((section) => section.id !== id); 
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
              postSettings.value.id = data.data.id;
              postSettings.value.title = data.data.title;

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
  // let url = 'http://localhost:3000/post/'; 
  let method = 'POST'; 
  if (!createPost.value) {
    url = `https://top-blog-api-proud-thunder-6960.fly.dev/post/${route.params.id}`;
    // url = `http://localhost:3000/post/${route.params.id}`;
    method = 'PUT';
  }
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

function setupPost(): Post {
  const title = postSettings.value.title ?? '' ;

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

function updateImageUrl(url : string | null) : void { 
  imageUrl.value = url; 
  console.log("Image URL", imageUrl.value);
}

function submitImage(): void { 
  if (!imageUrl.value) { return; }
  let imgHtml = `<figure>
                  <img src="${imageUrl.value}" alt="" class="post-image"/>
                  <figcaption>Caption....</figcaption>
                </figure>  
                `
  if (headerImg.value) { 
    imgHtml = `<img src="${imageUrl.value}" class="header-img" alt=""/>`
  }

  documentModel.value.push({
    id: documentModel.value.length, 
    type: 'image',
    content: imgHtml
  })

  showModal.value = false; 
  imageUrl.value = null; 
  headerImg.value = false; 
}


onMounted(async () => {
  if (route.params.id) {
    createPost.value = false; 
    await getPostById(); 
  }
});
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
.toolbar-border {border: 1px solid var(--color)}

.toolbar button {
  padding: 5px 10px;
  border: none;
  background-color: #0073aa;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.header-img { 
  max-width: 100vw; 
  object-fit: cover;
  object-position: top;
}

[contenteditable] {
  outline: none;
  border: 1px solid lightgray;
  padding: 4px;
  margin: 4px 0;
}



</style>