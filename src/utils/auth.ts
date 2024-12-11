import { jwtDecode }  from 'jwt-decode'

export function isAuthenticated(): boolean { 
    const token = localStorage.getItem('jwt'); 
    if (!token) { return false;}

    try { 
        const decodeToken: any = jwtDecode(token);
        console.log(decodeToken);  
        return true;
        // const currentTime = Date.now() /1000; 
        // return decodeToken.exp > currentTime; 
    } catch(err) { 
        return false; 
    }
}