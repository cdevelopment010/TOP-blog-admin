<template>
    <div class=" w-80 mx-auto">
        <div class="d-flex flex-column">
            <label for="slug" class="flex-start">Slug:</label>
            <input type="text" v-model="postSettings.slug" @input="updateField('slug', postSettings.slug || '');updateField('slugCombined', slugCombined)">
            <small>{{ slugCombined }}</small>
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
    slugCombined?: string | null,
    tags?: {id: number, name: string}[] | null,
    description?: string | null,
    keywords?: string | null
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

const slugCombined = computed(() =>
    postSettings.value.slug?.toLowerCase().split(" ").join("-") || ""
);

function updateField(field: keyof PostSettings, value: string | null | number | undefined | {id: number, name: string}[]) {
    postSettings.value = { ...postSettings.value, [field]: value };
    console.log("postSettings", postSettings.value);
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

const refreshTags = async (): Promise<Tag[] | void> => {
    try {
        const response = await fetch('https://top-blog-api-production.up.railway.app/tag/', {
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