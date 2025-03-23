<template>
    <div class="card">
      <div v-if="$slots['card-header']" class="card-header">
        <slot name="card-header" />
      </div>
  
      <div class="card-body">
        <slot />
      </div>
  
      <div v-if="$slots['card-footer']" class="card-footer">
        <slot name="card-footer" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // no logic needed for now
  </script>
  
  <style scoped>
  .card {
    border-radius: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    background: var(--background-color);
    overflow: hidden;
    border: 1px solid var(--accent-color-1);
  }
  
  .card-header {
    font-weight: bold;
    font-size: 1.1rem;
    color: var(--color);
  }
  
  .card-body {
    font-size: 1rem;
    color: var(--color);
  }
  
  .card-footer {
    border-top: 1px solid #eee;
    font-size: 0.9rem;
    color: var(--color);
  }
  </style>
  