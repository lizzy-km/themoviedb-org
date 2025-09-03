import './App.css'
import {useEffect} from "react";
import {useGet24Changes, useGetTrending} from "./services/mutation/commonMutation.js";
import Index from "./Page/Index.jsx";

function App() {

const {mutate,data} = useGet24Changes('person','GET',1)

    useEffect(() => {
    mutate()
    }, [mutate]);

console.log(data)

  return (
    <div className=" w-[100%] m-0 p-0 flex   h-auto">
      <Index />
    </div>
  )
}

export default App
