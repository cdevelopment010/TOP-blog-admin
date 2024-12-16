import { jwtDecode }  from 'jwt-decode'
import { ref } from "vue"; 

interface User {
    admin: boolean, 
    id: number, 
    email: string, 
    createdAt: Date, 
    name: string, 
    updatedAt: Date,
}
export const currentUser = ref<User|null>(null);

export function isAuthenticated(): boolean { 
    const token = localStorage.getItem('jwt'); 
    if (!token) { return false;}

    try { 
        const decodeToken: any = jwtDecode(token);
        console.log(decodeToken);  
        const currentTime = Date.now() /1000; 
        return decodeToken.exp > currentTime; 
    } catch(err) { 
        return false; 
    }
}