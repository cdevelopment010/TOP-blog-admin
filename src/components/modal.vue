<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-content">
            <button class="modal-close" @click="closeModal">x</button>
            <slot name="header"></slot>
            <slot></slot>
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">

    import { defineProps, defineEmits } from "vue";
    
    const props = defineProps({
        show: Boolean
    });
    const emit = defineEmits(["close"]);
    const closeModal = () => emit("close");
</script>


<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal-content {
    background: white;
    color: black;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    width: 90%;
    max-width: 500px;
}
.modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}
</style>