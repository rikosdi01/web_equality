import { Activity, Backpack, BadgeCheckIcon, Box, ClipboardEdit, Computer, FilePlus2, FileWarning, HandCoins, History, LayoutDashboard, LayoutGrid, Locate, LucideSquareEqual, Map, NotebookPen, Package, PackageMinus, PiggyBank, Receipt, SendToBack, Settings, Ship, Store, Truck, UserCog, Users, UsersRound, Warehouse } from "lucide-react";
import Sidebar, { SidebarItem } from "./Sidebar";
import React from "react";

const SidebarPages = () => {
    return (
        <Sidebar>
            <SidebarItem
                icon={<History size={20} />}
                text="Terbaru"
                to="/recents"  // Mengarah ke halaman Dashboard
            />
            <SidebarItem
                icon={<LucideSquareEqual size={20} />}
                text="Persamaan"
                to="/equality-products"  // Mengarah ke halaman Dashboard
            />
            <SidebarItem
                icon={<Activity size={20} />}
                text="Penjualan"
                to="/sales-products"  // Mengarah ke halaman Dashboard
            />
            <hr />
            <SidebarItem
                icon={<Settings size={20} />}
                text="Pengaturan"
                to="/settings"  // Mengarah ke halaman Kategori
            />
        </Sidebar>
    );
}

export default SidebarPages;