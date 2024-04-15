import React from "react";
import LoginStore from "./login.Store.js";

class RootStore{
    constructor(){
        this.loginStore = new LoginStore()
    }
}

const Context = React.createContext(new RootStore())

export const useStore =  ()=>React.useContext(Context) //new RootStore()
