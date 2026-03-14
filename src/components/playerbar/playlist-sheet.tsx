import {
  Delete24Regular,
  Dismiss24Regular,
  TextBulletList24Regular,
} from "@fluentui/react-icons";

import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Sheet,
} from "../ui/sheet";
import { usePlayerStore } from "@/lib/store/playerStore";
import { PlaylistSongPreview } from "./playlist-song-preview";
import { useUserStore } from "@/lib/store/userStore";
import { useMemo, useState } from "react";
import { YeeButton } from "../yee-button";
import { Virtuoso } from "react-virtuoso";

export function PlaylistSheet() {
  const { playlist, currentSong, clearPlaylist } = usePlayerStore();
  const { likeListSet } = useUserStore();
  const [open, setOpen] = useState(false);

  const initialIndex = useMemo(
    () =>
      currentSong ? playlist.findIndex((s) => s.id === currentSong.id) : 0,
    [currentSong, playlist],
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <YeeButton
          variant="ghost"
          icon={<TextBulletList24Regular className="size-6" />}
        />
      </SheetTrigger>
      <SheetContent
        className="bg-card p-2 pr-0 w-full rounded-md"
        showCloseButton={false}
      >
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle>播放列表</SheetTitle>
            <div className="flex gap-2">
              <YeeButton
                variant="ghost"
                onClick={clearPlaylist}
                icon={<Delete24Regular />}
              />
              <YeeButton
                variant="ghost"
                onClick={() => setOpen(false)}
                icon={<Dismiss24Regular />}
              />
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 w-full -mt-8">
          <Virtuoso
            data={playlist}
            initialTopMostItemIndex={initialIndex !== -1 ? initialIndex : 0}
            itemContent={(_, song) => (
              <div className="px-4 py-4">
                <PlaylistSongPreview
                  song={song}
                  isPlaying={song.id === currentSong?.id}
                  isLike={likeListSet.has(Number(song.id))}
                  setOpen={setOpen}
                />
              </div>
            )}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
