<template>
    <div class="bullet-list-container">
        <ul>
            <li v-for="(item, index) in bulletPoints" :key="index">
                <input
                    v-model="bulletPoints[index]"
                    type="text"
                    placeholder="Add bulletpoints"
                    @input="updateList"
                    >
                <button @click="removeBullet(index)">[X]</button>
            </li>
        </ul>
        <button @click="addBullet">Add Bullet Point</button>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps<{ data: string[] }>();
const emit = defineEmits(['update']);

const bulletPoints = ref<string[]>(props.data || []);

watch(bulletPoints, () => {
    emit('update', bulletPoints.value);
},{deep: true}); 

const addBullet = () => { 
    bulletPoints.value.push(''); 
}

const removeBullet = (index: number) => {
    bulletPoints.value.splice(index, 1); 
}

const updateList = () => {
    emit('update', bulletPoints.value); 
}

</script>