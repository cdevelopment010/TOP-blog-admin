<template>
    <div class="toast-container">
        <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type">
            <h4 v-if="toast.title">{{ toast.title }}</h4>
            <p>{{ toast.message }}</p>
            <button @click="removeToast(toast.id)">X</button>
        </div>
    </div>

</template>

<script setup lang="ts">
import { useToast } from '../utils/useToast';

const { toasts, removeToast} = useToast(); 

</script>


<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  padding: 10px 15px;
  border-radius: 5px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 250px;
  transition: opacity 0.3s ease-in-out;
}

.toast.success { background: #4CAF50; }
.toast.warning { background: #FFC107; }
.toast.danger { background: #F44336; }
.toast.info { background: #2196F3; }

button {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}
</style>