import { Outlet } from "react-router-dom";
import AdminSidebar from "../Admin/AdminSidebar";
import AdminTopbar from "../Admin/AdminTopbar";

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-gray-950 text-white font-sans">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <AdminTopbar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
