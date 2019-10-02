var storage = {
    set(key,value){
        localStorage.setItem(key,JSON.stringify(value))
    },
    get(key){
        return JSON.parse(localStorage.getItem(key))
    },
    remove(key){
        localStorage.removeItem(key)
    },
    setToken(value){
        localStorage.setItem('token',value)
    },
    getToken(){
        return localStorage.getItem('token')
    },
    removeToken(){
        localStorage.removeItem('token')
    }
}

export default storage;