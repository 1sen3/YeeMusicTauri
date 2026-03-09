import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Playlist } from "@/lib/types";
import { cn, formateDate } from "@/lib/utils";
import {
  Heart24Filled,
  Heart24Regular,
  LockClosed24Filled,
  Play24Filled,
  Search24Filled,
} from "@fluentui/react-icons";
import { useState } from "react";
import { PlaylistSongs } from "./playlist-songs";
import { usePlayerStore } from "@/lib/store/playerStore";
import { YeeButton } from "@/components/yee-button";
import { useUserStore } from "@/lib/store/userStore";
import { subscribePlaylist } from "@/lib/services/playlist";
import { toast } from "sonner";
import { PlaylistEditButton } from "../playlist-edit-button";
import { PlaylistDeleteButton } from "../playlist-delete-button";

export function PlaylistPage({
  playlist,
  isMyPlaylist,
  onRefresh,
}: {
  playlist: Playlist;
  isMyPlaylist: boolean;
  onRefresh?: () => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const playList = usePlayerStore((s) => s.playList);

  const playlistId = playlist.id;
  const isFavList = isMyPlaylist && playlist.specialType === 5;
  const title = isFavList ? "我喜欢的音乐" : playlist.name;
  const coverImgUrl = playlist.coverImgUrl;

  const creatorName = playlist.creator.nickname;
  const creatorAvatarUrl = playlist.creator.avatarUrl;
  const createTime = playlist.createTime;

  const toggleLikePlaylist = useUserStore((s) => s.toggleLikePlaylist);
  const subscribedPlaylists = useUserStore((s) => s.subscribedPlaylists);
  const isSubscribed = subscribedPlaylists.some((pl) => pl.id === playlist.id);
  const LikeIcon = isSubscribed ? Heart24Filled : Heart24Regular;

  const isPrivacy = playlist.privacy === 10;

  async function handleLike() {
    const targetState = !isSubscribed;
    toggleLikePlaylist(playlist, targetState);
    try {
      const res = await subscribePlaylist(targetState ? 1 : 2, playlistId);
      if (!res) {
        toggleLikePlaylist(playlist, isSubscribed);
        toast.error("操作失败，请重试", { position: "top-center" });
      }
    } catch (err) {
      console.error("切换歌单喜欢状态失败", err);
      toggleLikePlaylist(playlist, isSubscribed);
      toast.error("操作失败，请重试", { position: "top-center" });
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex gap-8 items-center mb-8">
        <div className="w-44 h-44 flex-none relative rounded-md overflow-hidden bg-zinc-100 drop-shadow-xl">
          <img
            src={coverImgUrl}
            alt={`${title} 封面`}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-6">
          <span className="text-2xl font-semibold flex gap-2 items-center">
            {title}
            {isPrivacy && (
              <LockClosed24Filled className="size-6 text-black/40" />
            )}
          </span>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <Avatar className="size-6 drop-shadow-md">
                <AvatarImage src={creatorAvatarUrl} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-foreground/80">{creatorName}</span>
            </div>
            <span className="text-foreground/60 text-sm">
              创建于 {formateDate(createTime)}
            </span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex justify-between items-center shrink-0 sticky top-0 z-10 py-6",
        )}
      >
        <div className="flex gap-4">
          <YeeButton
            variant="outline"
            onClick={() => playList(playlistId, "list")}
            disabled={playlist.trackCount === 0}
            icon={<Play24Filled className="size-4" />}
            className="bg-card/40! backdrop-blur"
          />
          {isMyPlaylist && !isFavList && (
            <>
              <PlaylistEditButton playlist={playlist} onSuccess={onRefresh} />
              <PlaylistDeleteButton playlist={playlist} />
            </>
          )}
          {!isMyPlaylist && (
            <YeeButton
              className="bg-white"
              variant="outline"
              icon={
                <LikeIcon
                  className={cn("size-4", isSubscribed && "text-red-500")}
                />
              }
              onClick={handleLike}
            />
          )}
        </div>

        <div className="relative flex items-center">
          <Search24Filled className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/60 pointer-events-none z-10" />
          <Input
            placeholder={searchOpen ? "搜索..." : ""}
            className={cn(
              "h-9 bg-white rounded-full border-0 drop-shadow-md",
              "focus:border-0 focus:ring-0!",
              "transition-all duration-300 ease-in-out",
              searchOpen ? "w-48 pl-8" : "w-9 cursor-pointer",
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => {
              if (!searchQuery) setSearchOpen(false);
            }}
          />
        </div>
      </div>

      <PlaylistSongs playlistId={playlistId} query={searchQuery} />
    </div>
  );
}
