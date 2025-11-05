import React from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";

const ICON_MAP = {
  pickleball: "🏓",
  horse: "🐴",
  paddle: "🎾",
  trophy: "🏆",
  star: "⭐",
  heart: "❤️",
  clover: "🍀",
  fire: "🔥",
  crown: "👑",
  gem: "💎",
  lightning: "⚡",
  sun: "☀️"
};

export default function ProfileMenu({ user, onLogout, onLoginClick }) {
  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-ranch-red text-ranch-red hover:bg-ranch-red hover:text-white transition-all duration-200"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Sign In</span>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 hover:border-ranch-red transition-colors flex items-center justify-center text-xl">
          {ICON_MAP[user.profile_icon] || ICON_MAP.pickleball}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.full_name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={createPageUrl("Profile")} className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Account Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-red-600 cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}