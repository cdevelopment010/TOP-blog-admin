import { reactive } from 'vue'


interface Toast { 
    id: number;
    title?: string; 
    message: string; 
    timeout?: number; 
    type: "success" | "warning" | "danger" | "info";
}

const toasts = reactive<Toast[]>([]); 

const addToast =  (toast: Omit<Toast, "id">) => {
    const id = Date.now(); 
    toasts.push({...toast, id}); 

    if (toast.timeout) { 
        setTimeout(() => removeToast(id), toast.timeout)
    }
}

const removeToast = (id: number) => {
    const index = toasts.findIndex((toast) =>toast.id === id); 
    if (index !== -1) {
        toasts.splice(index, 1); 
    }
}

export function useToast() { 
    return { toasts, addToast, removeToast}
}