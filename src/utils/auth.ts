import { jwtDecode }  from 'jwt-decode'
import { ref } from "vue"; 
import { supabase } from './supabase';


interface User {
    admin: boolean, 
    id: number, 
    email: string, 
    createdAt: Date, 
    name: string, 
    updatedAt: Date,
}
export const currentUser = ref<User|null>(null);

supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth state changed:", event, session);
    
    if (session?.access_token) {
        // Save token to localStorage after successful login
        localStorage.setItem('jwt', session.access_token);
    }
});

export function isAuthenticated(): boolean { 

    const token = localStorage.getItem('jwt'); 
    if (!token) { return false;}

    try { 
        const decodeToken: any = jwtDecode(token);
        // console.log(decodeToken);  
        const currentTime = Date.now() /1000; 
        return decodeToken.exp > currentTime; 
    } catch(err) { 
        return false; 
    }
}