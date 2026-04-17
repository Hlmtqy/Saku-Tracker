import { useState } from "react";

export function useLocalStorage(key, initialvalue){
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") return initialvalue;
    try{//masukkan perintah
      const item = window.localStorage.getItem(key) ;
      return item ? JSON.parse(item) : initialvalue
    }catch (error){//cek eror
      console.log(error);
      return initialvalue;
    }
  });
//simpan data ke localstorage
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;//cek vlue yg di simpan ada atau gak
      setStoredValue(valueToStore);//di update
      if (typeof window !== "undefined")
        {window.localStorage.setItem(key, JSON.stringify(valueToStore))//simpan ke local storage
      }
    } catch (error) {
      console.log(error)
    }
  }
  return [storedValue,setValue]
}