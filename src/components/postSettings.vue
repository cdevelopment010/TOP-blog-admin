<template>
    <div class=" w-80 mx-auto">
        <div class="d-flex flex-column">
            <label for="slug" class="flex-start">Title:</label>
            <input type="text" v-model="postSettings.title" @input="updateField('title', postSettings.title || '')">
        </div>

        <div class="d-flex flex-column">
            <label for="slug" class="flex-start">Slug:</label>
            <input type="text" v-model="postSettings.slug" @input="updateField('slug', postSettings.slug || '')">
        </div>

        <div class="d-flex  flex-column">
            <label class="flex-start">Tags</label>
            <select @change="addTag" v-model="currentTag">
                <option value=""></option>
                <template v-for="(tag, index) in availableTags">
                    <option :value="tag.id">{{ tag.name }}</option>
                </template>
            </select>
            <template v-for="(tag, index) in tags">
                <!-- {{  tag[0] }} -->
                <div @click="deleteTag(index)" class="pill" title="Click to remove">{{ tag.name }}</div>
            </template>
        </div>

        <div class="d-flex  flex-column">
            <label class="flex-start">Meta Description:</label>
            <textarea v-model="postSettings.description"
                @input="updateField('description', postSettings?.description || '')"></textarea>
        </div>
        <div class="d-flex flex-column">
            <label class="flex-start">Meta Keywords:</label>
            <textarea v-model="postSettings.keywords"
                @input="updateField('keywords', postSettings?.keywords || '')"></textarea>
        </div>

        <div class="mt-3">
            <button class="me-2" @click="$emit('saveAndPublish', postSettings)">Save & publish</button>
            <button @click="$emit('save', postSettings)">Save</button>
        </div>

    </div>

    <!-- 
        - Meta tags
            - robots <meta name="robots" content="noindex">
    -->
</template>

<script setup lang="ts">
import { ref, watch, computed, reactive, onMounted } from "vue";

interface Tag { 
    id:number,
    name: string, 
    createdById: number, 
    createdByUser: string, 
    createdAt: Date, 
    updatedById: number, 
    updatedAt: Date, 
}

interface PostSettings {
    id?: number | null,
    slug?: string | null,
    tags?: {id: number, name: string}[] | null,
    description?: string | null,
    keywords?: string | null
    title?: string | null
}

const availableTags = ref<Tag[]>([]);
const props = defineProps<{ postSettings: PostSettings }>();
const emit = defineEmits<{
    (event: 'update', updatedSettings: any): void
    (event: 'save', updatedSettings: PostSettings): void
    (event: 'saveAndPublish', updatedSettings: PostSettings): void
}>();
const postSettings = ref<PostSettings>({ ...props.postSettings });
const tags = ref<{id: number, name: string}[]>([]);
const currentTag = ref("");

watch(() => props.postSettings, (newSettings) => {
    postSettings.value = { ...newSettings };
}, { deep: true });

watch(() => props.postSettings.id, async (newId) => {
    if (newId !== null) { await getSelectedTags()}
})

function updateField(field: keyof PostSettings, value: string | null | number | undefined | {id: number, name: string}[]) {
    postSettings.value = { ...postSettings.value, [field]: value };
    emit('update', postSettings.value);
}

function addTag(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = parseInt(target.value) * 1;
    const tagToAdd = availableTags.value.find(t => t.id == value);
    if (!tagToAdd) { return }
    tags.value.push({id: tagToAdd.id, name: tagToAdd.name});
    currentTag.value = "";
    postSettings.value.tags = tags.value; 
    emit('update', postSettings.value);
}

function deleteTag(index: number) {
    tags.value.splice(index, 1);

}

const getSelectedTags = async() => { 
    try { 
        if (postSettings.value.id == null ) { throw new Error("Missing post ID to retrieve tags.")}
        const url = `https://top-blog-api-proud-thunder-6960.fly.dev/post/${postSettings.value.id}/tags`
        const response = await fetch(url, {
            mode: 'cors',
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json', 
                'authorization': `bearer: ${localStorage.getItem('jwt')}` 
            },
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("ERROR: Tags -", errorResponse);
            throw new Error(`Error: ${errorResponse.message || "Failed to fetch tags for post"}`);
        }

        const data = await response.json();
        tags.value = data.data.tags;
    } catch (err) {
        console.error("err:", err); 
    }
}

const refreshTags = async (): Promise<Tag[] | void> => {
    try {
        // const url = "http://localhost:3000/tag/"
        const url = "https://top-blog-api-proud-thunder-6960.fly.dev/tag/"
        const response = await fetch(url, {
            mode: 'cors',
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json', 
                'authorization': `bearer: ${localStorage.getItem('jwt')}` 
            },
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("ERROR: Tags -", errorResponse);
            throw new Error(`Error: ${errorResponse.message || "Failed to fetch tags"}`);
        }

        const data = await response.json();
        return data.data; // Ensure this is returned properly
    } catch (err) {
        console.error(err);
    }
};

onMounted( async() => {
    //load tags
    availableTags.value = await refreshTags() ?? []; 
    await getSelectedTags(); 
})

</script>

<style scoped>
.pill {
    margin-top: 0.25rem;
    border-radius: 10px;
    min-width: 150px;
    cursor: pointer;
    background: var(--accent-color-1);
    color: var(--background-color);
    border: 1px solid transparent;
}

.pill:hover {
    font-weight: bold;
    border: 1px solid var(--color)
}
</style>