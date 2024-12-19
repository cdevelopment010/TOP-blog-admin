<template>
    <div>
      <button @click="fetchHtml">Load HTML</button>
      <div v-for="(element, index) in parsedData" :key="index">
        <DynamicElement :element="element" />
      </div>
    </div>
  </template>
  
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  // Define the structure of a parsed element
  interface ParsedElement {
    tag: string;
    attributes: Record<string, string>;
    content: string | null; // Direct text content (if any)
    children: ParsedElement[]; // Nested elements
  }
  
  const rawHtml = ref('');
  const parsedData = ref<ParsedElement[]>([]);
  
  const fetchHtml = async () => {
    // Simulate API call
    rawHtml.value = `<section><h1>Cool title</h1><div><span>Tag information</span></div></section><section><p>paragraph 1</p><p>Paragraph 2 <a href="somelink">Here</a>.</p><img src="" alt=""></section>`;
  
    // Parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml.value, 'text/html');
  
    // Convert HTML to reactive data
    parsedData.value = Array.from(doc.body.children).map((node) =>
      convertNodeToElement(node)
    );
  };
  const convertNodeToElement = (node: Node): ParsedElement => {
  if (node.nodeType === Node.TEXT_NODE) {
    // Text node handling
    const textContent = node.textContent?.trim(); // Remove extra spaces
    if (textContent) {
      return {
        tag: '', // No tag for text nodes
        attributes: {},
        content: textContent,
        children: [],
      };
    } else {
      // Return empty element if no text
      return { tag: '', attributes: {}, content: null, children: [] };
    }
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as HTMLElement;
    const children = Array.from(element.childNodes).map(convertNodeToElement);

    return {
      tag: element.tagName.toLowerCase(),
      attributes: Array.from(element.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {} as Record<string, string>),
      content: null, // Elements don't have direct content, it will be handled by children
      children: children.filter(child => child.content || child.children.length), // Only add children with content
    };
  }

  return { tag: '', attributes: {}, content: null, children: [] }; // Default return for other cases
};
  </script>
  