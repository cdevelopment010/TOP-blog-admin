<template>
    <div class="toast-container">
        <div v-for="toast in toasts" :key="toast.id" class="toast d-flex flex-column" :class="toast.type">
            <div class="toast-header d-flex align-items-center justify-content-between">
              <h4 v-if="toast.title" class="m-0">{{ toast.title }}</h4>
              <button @click="removeToast(toast.id)" class="m-0">X</button>
            </div>
            <p>{{ toast.message }}</p>
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
  top: 20px;
  left: 20px;
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
  /* align-items: center; */
  min-width: 250px;
  transition: opacity 0.3s ease-in-out;
  position: relative;
}

.toast.success { background: #4CAF50; }
.toast.warning { background: #FFC107; }
.toast.danger { background: #F44336; }
.toast.info { background: #2196F3; }

h4 { 
  padding: 0; 
  margin: 0;
}
button {
  position: absolute; 
  top: 8px; 
  right: 12px; 
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin: 0; 
  padding: 0;
}
</style>