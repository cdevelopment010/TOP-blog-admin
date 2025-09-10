<template>
    <div class="container">
      <div class="nav-container">
        <NavComponent />
      </div>
      <div class="body-container post-grid">
        <!-- Main section -->
        <div class="create-post-section">
          <template v-for="(el) in html" :key="el.id">
                    <h1 
                        v-if="el.type === 'header1'" 
                        v-html="el.content">
                    </h1>
                    <h2 
                        v-if="el.type === 'header2'" 
                        v-html="el.content">
                    </h2>
                    <h3
                        v-if="el.type === 'header3'" 
                        v-html="el.content">
                    </h3>
                    <h4 
                        v-if="el.type === 'header4'" 
                        v-html="el.content">
                    </h4>
                    <div
                        v-else-if="el.type == 'tag'"
                        id="tag-section"
                    > 
                    </div>


                    <p 
                        v-else-if="el.type === 'paragraph'"
                        v-html="el.content">
                    </p>

                    <div
                      v-else-if="el.type === 'embedded'"
                      v-html="el.content"  
                    >

                    </div>

                    <ul
                        v-else-if="el.type === 'list'"
                    >
                        <template v-for="(child, _) in el.children" :key="'list-'+el.id+'-'+_">
                            <li>{{ child }}</li>
                        </template>

                    </ul>

                    <blockquote 
                        v-else-if="el.type === 'quote'" 
                        v-html="el.content"
                        >
                    </blockquote>

                    <div v-else-if="el.type === 'code'">
                        <pre>
                        <code :class="`language-${el.language}`" v-html="el.content"></code>
                        </pre>

                    </div>
                    <a 
                        v-else-if="el.type === 'link'" 
                        v-html="el.content"
                        >
                    </a>

                    <!-- <div 
                        v-else-if="el.type == 'image'"
                        class="image-container spotlight"
                        :data-src="extractImgSrc(el.content)"
                        v-html="el.content"
                        >  -->
                    <!-- </div> -->
                </template>
        </div>
      </div>
  
    </div>
  </template>
  
  
  <script setup lang="ts">
  import { ref, watch, onMounted, nextTick} from 'vue';
  import { useRoute } from 'vue-router';
  import NavComponent from '../components/nav.vue';
  import PreviewComponent from '../components/previewComponent.vue';
  import PostSettings from '../components/postSettings.vue';  
  
  const route = useRoute();
  
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
  
  const html = ref<element[]>([
    { id: 0, html: "<h1>Loading...</h1>", children: [], attributes: "", editing: true, hover: false }
  ])
  const postSettings = ref<PostSettings>({
    id: null,
    slug: '',
    description: '',
    tags: [],
    keywords: ''
  });
  // watch(html, (newVal) => {
  //   loadGoogleAds(); 
  // }, { deep: true });
  
  

  
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
                // loadGoogleAds(); 
              }
          })
          .catch(err => {
              console.error(err); 
          })
  }

  function loadGoogleAds() {
  nextTick(() => {
    const ads = document.getElementsByClassName("ads");
    console.log("ads", ads);

    for (const ad of ads) {
      const adElement = ad as HTMLElement;
      if (!adElement.dataset.adLoaded) {
        adElement.innerHTML = `
          <ins class="adsbygoogle"
               style="display:block; text-align:center;"
               data-ad-layout="in-article"
               data-ad-format="fluid"
               data-ad-client="ca-pub-7371197725995262"
               data-ad-slot="3466167982">
          </ins>
        `;
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adElement.dataset.adLoaded = "true"; // Mark this ad as loaded
        } catch (err) {
          console.error("Error initializing adsbygoogle:", err);
        }
      }
    }
  });
}
  
  onMounted(async () => {
    await getPostById(); 
  })

  </script>
  
  <style scoped>
  .post-grid {
    display: grid;
    grid-template-columns: 8fr 2fr;
  }
  

  .border-left {
    border-left: 1px solid var(--color)
  }
    
  </style>