import {useEffect, useState} from "react"

export default function useKeyPress(targetKey) {
    const [keyPressed, setKeyPressed] = useState(false);
  
    const downHandler = ({ key }) => {
      if (key === targetKey) setKeyPressed((prev) => !prev);
    };
  
    useEffect(() => {
      window.addEventListener('keydown', downHandler);
  
      return () => {
        window.removeEventListener('keydown', downHandler);
      };
    }, []);
  
    return keyPressed;
  };