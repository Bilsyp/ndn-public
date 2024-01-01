import Nav from "./comps/Nav";
import { Outlet } from "react-router-dom";
const App = () => {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
};

export default App;
