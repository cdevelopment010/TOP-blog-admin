import { jwtDecode }  from 'jwt-decode'
import { ref, onMounted } from "vue"; 
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

// supabase.auth.onAuthStateChange((event, session) => {
//     console.log("Auth state changed:", event, session);

//     if (session?.access_token) {
//         console.log("Saving token to localStorage...");
//         localStorage.setItem("jwt", session.access_token);
//     } else {
//         console.log("No session found, clearing storage.");
//         localStorage.removeItem("jwt");
//     }
// });

export function isAuthenticated(): boolean { 

    // console.log(localStorage.getItem('jwt')); 

    const token = localStorage.getItem('jwt'); 
    // if (token == undefined) { return true} //Issue with Google auth, doesn't set it straight away so always redirects to sign in
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

onMounted(async () => {
    // console.log("Checking session on mount...");
    const { data } = await supabase.auth.getSession();

    // if (data.session?.access_token) {
    //     console.log("Session found on mount:", data);
    //     localStorage.setItem("jwt", data.session.access_token);
    // } else {
    //     console.log("No session found on mount.");
    // }
});