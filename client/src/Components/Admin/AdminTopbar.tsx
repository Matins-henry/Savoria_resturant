import { Bell, Search, User } from "lucide-react";

export default function AdminTopbar() {
    return (
        <header className="h-20 bg-gray-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-20">
            {/* Search */}
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search for orders, items..."
                    className="w-full bg-gray-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                <button className="relative text-gray-400 hover:text-white transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-gray-950" />
                </button>

                <div className="h-8 w-px bg-white/10" />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">Admin User</p>
                        <p className="text-xs text-gray-500">Super Admin</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center overflow-hidden">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>
        </header>
    );
}
