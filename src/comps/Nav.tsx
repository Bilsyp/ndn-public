import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoSunnyOutline } from "react-icons/io5";
import { LuMoonStar } from "react-icons/lu";
import { useTheme } from "@/components/theme-provider";
import { Link } from "react-router-dom";
export default function Nav() {
  const { theme, setTheme } = useTheme();
  return (
    <nav className=" flex dark:bg-[hsl(263.4,70%,50.4%)] dark:text-white bg-gray-100  justify-between py-3 items-center px-3 lg:px-10 w-full ">
      <div className="brand">
        <Link to="/">
          <h1 className=" text-2xl  font-semibold">NDN</h1>
        </Link>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className="outline-none border-none dark:text-white text-2xl">
              {theme == "light" ? <LuMoonStar /> : <IoSunnyOutline />}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
