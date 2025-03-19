import {Outlet} from "react-router";
import Navbar from "../navbar.jsx";

export default function LayoutPage() {
  return <div>
    <Navbar/>
    <main className="m-4 min-h-screen">
      <Outlet/>
    </main>
    <footer className="bg-secondary-900 text-white p-4 text-center text-sm">
      <p>&copy; {new Date().getFullYear()}. Project by <a href="https://i10e.dev" target="_blank">i10e</a>.</p>
    </footer>
  </div>
}
