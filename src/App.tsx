import { ThemeProvider } from "@/components/theme-provider"

import viteLogo from "/DICT.png";

import { Link, Outlet } from "react-router-dom";

// import { ModeToggle } from "./components/mode-toggle";
// import Reveal from "./components/animation/reveal";
import { SearchIcon } from "lucide-react";
import NavLink from "./components/link/link";

function App() {


  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
     <div className=" bg-background min-h-screen w-full overflow-hidden flex flex-col  items-center">
      
      <nav className=" pointer-events-none animate__animated animate__slideInDown  z-20 bg-background/0 fixed flex justify-between items-center w-full max-w-[1468px] py-5 border-b-[0px] border-accent \ ">
        <Link className=" ml-5" to="/react-vite-supreme" >
          <img src={viteLogo} className="logo h-28 object-contain sm:h-7 " alt="DICT logo" />
        </Link>
       
       
      </nav>
 

      
      <div className=" min-h-full w-full flex items-center justify-center ">
         <Outlet />
      </div>
     
     
    </div>
    </ThemeProvider>
  )
}



export default App
