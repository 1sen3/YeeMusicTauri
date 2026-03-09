import { ChevronRight, ChevronUp, LogIn } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarSeparator,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  Person24Regular,
  Album24Regular,
  Clock24Regular,
  Heart24Regular,
  Home24Regular,
  Home24Filled,
  Clock24Filled,
  Album24Filled,
  Heart24Filled,
  FluentIcon,
  Cloud24Regular,
  Cloud24Filled,
  List24Regular,
  Add24Filled,
  Settings24Regular,
  SignOut24Regular,
} from "@fluentui/react-icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoginForm } from "./modal/login-form";
import { useUserStore } from "@/lib/store/userStore";
import { LogoutForm } from "./modal/logout-form";
// import { usePathname, useSearchParams } from "next/navigation";
import { useLocation, useSearchParams } from "react-router-dom";
import { Playlist } from "@/lib/types";
import { PlaylistAddForm } from "./modal/playlist-add-form";

const mainItems = [
  {
    title: "主页",
    url: "/",
    icon: Home24Regular,
    activeIcon: Home24Filled,
  },
];

const libraryItems = [
  {
    title: "最近播放",
    url: "/library/recent",
    icon: Clock24Regular,
    activeIcon: Clock24Filled,
  },
  {
    title: "专辑",
    url: "/library/album",
    icon: Album24Regular,
    activeIcon: Album24Filled,
  },
  {
    title: "网盘",
    url: "/library/cloud",
    icon: Cloud24Regular,
    activeIcon: Cloud24Filled,
  },
];

const playlistItems = [
  {
    title: "我喜欢的音乐",
    url: "/favorite",
    icon: Heart24Regular,
    activeIcon: Heart24Filled,
  },
];

export function AppSidebar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isPlaylistAddOpen, setIsPlaylistAddOpen] = useState(false);

  const createdPlaylists = useUserStore((s) => s.createdPlaylists);
  const subscribedPlaylists = useUserStore((s) => s.subscribedPlaylists);

  const user = useUserStore((state) => state.user);

  const location = useLocation();
  const pathName = location.pathname;
  const [searchParams] = useSearchParams();
  const currentId = searchParams.get("id");

  const isItemActive = (item: {
    title: string;
    url: string;
    icon: FluentIcon;
    activeIcon: FluentIcon;
  }) => {
    if (item.url && item.url != "#") {
      return pathName === item.url || pathName.startsWith(item.url + "/");
    }

    return false;
  };

  const isPlaylistActive = (playlist: Playlist) => {
    const isMatchedPath =
      pathName === "/detail/playlist" || pathName === "/detail/playlist/";
    return isMatchedPath && currentId === String(playlist.id);
  };

  const navigate = useNavigate();

  return (
    <>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="absolute! h-full!"
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isItemActive(item)}>
                      <Link to={item.url}>
                        {isItemActive(item) ? (
                          <item.activeIcon className="size-5 text-primary" />
                        ) : (
                          <item.icon className="size-5" />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="mx-2! w-auto!" />

          <SidebarGroup>
            <SidebarGroupLabel>资料库</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {libraryItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isItemActive(item)}>
                      <Link to={item.url}>
                        {isItemActive(item) ? (
                          <item.activeIcon className="size-5 text-primary" />
                        ) : (
                          <item.icon className="size-5" />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="mx-2! w-auto!" />

          <SidebarGroup>
            <SidebarGroupLabel>播放列表</SidebarGroupLabel>
            <SidebarGroupContent>
              {playlistItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isItemActive(item)}>
                    <Link to={item.url}>
                      {isItemActive(item) ? (
                        <item.activeIcon className="size-5 text-primary" />
                      ) : (
                        <item.icon className="size-5" />
                      )}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <Collapsible defaultOpen className="group/collapsible py-1">
                <SidebarMenuItem key={"歌单"}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <List24Regular />
                      <span>歌单</span>
                      <ChevronRight className="ml-auto transition-transform duraition-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => setIsPlaylistAddOpen(true)}
                        >
                          <div className="flex items-center gap-2">
                            <div className="size-6 relative rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
                              <Add24Filled className="size-4!" />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              新建歌单
                            </span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {createdPlaylists.map((playlist) => (
                        <SidebarMenuItem key={playlist.id}>
                          <SidebarMenuButton
                            asChild
                            isActive={isPlaylistActive(playlist)}
                          >
                            <Link to={`/detail/playlist?id=${playlist.id}`}>
                              <div className="flex items-center gap-2">
                                <div className="size-6 relative rounded-sm overflow-hidden">
                                  <img
                                    src={playlist.coverImgUrl}
                                    alt={`${playlist.name} 歌单封面`}
                                    className="size-6"
                                  />
                                </div>
                                <span>{playlist.name}</span>
                              </div>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                      {subscribedPlaylists.map((playlist) => (
                        <SidebarMenuItem key={playlist.id}>
                          <SidebarMenuButton
                            asChild
                            isActive={isPlaylistActive(playlist)}
                          >
                            <Link to={`/detail/playlist?id=${playlist.id}`}>
                              <div className="flex items-center gap-2">
                                <div className="size-6 relative rounded-sm overflow-hidden shrink-0">
                                  <img
                                    src={playlist.coverImgUrl}
                                    alt={`${playlist.name} 歌单封面`}
                                    className="size-6"
                                  />
                                </div>
                                <span className="line-clamp-1">
                                  {playlist.name}
                                </span>
                              </div>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Avatar className="size-6 -ml-0.5">
                      <AvatarImage src={user?.avatarUrl} alt="1sen" />
                      <AvatarFallback>
                        <Person24Regular />
                      </AvatarFallback>
                    </Avatar>
                    <span className="ml-1">{user?.nickname || "未登录"}</span>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="h-auto ">
                  {!user && (
                    <DropdownMenuItem onClick={() => setIsLoginOpen(true)}>
                      <LogIn />
                      登录
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/setting");
                    }}
                  >
                    <Settings24Regular />
                    设置
                  </DropdownMenuItem>

                  {!!user && (
                    <>
                      <DropdownMenuItem
                        onClick={() => {
                          navigate("/profile");
                        }}
                      >
                        <Person24Regular />
                        个人信息
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setIsLogoutOpen(true)}
                      >
                        <SignOut24Regular />
                        退出登录
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <LoginForm open={isLoginOpen} onOpenChange={setIsLoginOpen} />
      <LogoutForm open={isLogoutOpen} onOpenChange={setIsLogoutOpen} />
      <PlaylistAddForm
        open={isPlaylistAddOpen}
        onOpenChange={setIsPlaylistAddOpen}
      />
    </>
  );
}
