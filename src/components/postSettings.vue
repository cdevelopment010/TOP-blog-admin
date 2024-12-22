<template>
    <div class="border-left">
        <div>
            <label for="slug">Slug:</label>
            <input type="text" v-model="postSettings.slug" @input="updateField('slug', postSettings.slug || '')">
            <small>{{ slugCombined }}</small>
        </div>

        <div>
            <label>Tags</label>
            <select @change="addTag" v-model="currentTag">
                <option value=""></option>
                <option value="JS" >JS</option>
                <option value="CSS" >CSS</option>
                <option value="HTML" >HTML</option>
                <option value="Vue" >Vue</option>
            </select>
            <template v-for="(tag, index) in tags">
                <div @click="deleteTag(index)">{{ tag }}</div> 
            </template>
        </div>

        <div>
            <label>Meta Description:</label>
            <textarea v-model="postSettings.description" @input="updateField('description', postSettings?.description || '')"></textarea>
        </div>
        <div>
            <label>Meta Keywords:</label>
            <textarea v-model="postSettings.keywords" @input="updateField('keywords', postSettings?.keywords || '')"></textarea>
        </div>
    
        <div>
            <button class="me-2">Save & publish</button>
            <button>Save</button>
        </div>
    
    </div>

    <!-- 
        - Meta tags
            - robots <meta name="robots" content="noindex">
        
    -->
</template>

<script setup lang="ts">
import { ref, watch, computed, reactive } from "vue"; 

interface PostSettings { 
    id?: number | null, 
    slug?: string | null, 
    tags?: [] | null, 
    description?: string | null, 
    keywords?: string | null
}
const props = defineProps<{postSettings: PostSettings}>(); 
const emit = defineEmits<{ (event: 'update', updatedSettings: any): void }>();
const postSettings = ref<PostSettings>({ ...props.postSettings });
const tags = ref<string[]>([]);
const currentTag = ref("");

watch(() => props.postSettings, (newSettings) => {
    postSettings.value = { ...newSettings };
}, { deep: true });

const slugCombined = computed(() =>
  postSettings.value.slug?.toLowerCase().split(" ").join("-") || ""
);

function updateField(field: keyof PostSettings, value: string | null | number | undefined) {
  postSettings.value = { ...postSettings.value, [field]: value }; 
  emit('update', postSettings.value); 
}

function addTag(event: Event) {
    const target = event.target as HTMLSelectElement; 
    const value = target.value; 
    tags.value.push(value);
    currentTag.value = ""; 
}

function deleteTag(index: number) {
    tags.value.splice(index, 1); 

}

</script>

<style scoped>
    .border-left {border-left: 1px solid var(--color)}
</style>