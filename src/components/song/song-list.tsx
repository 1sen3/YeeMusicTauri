import { Song } from "@/lib/types";
import { SongListItem } from "./song-list-item";
import { Virtuoso } from "react-virtuoso";

export function SongList({
  songList,
  showCover = true,
  showAlbum = false,
}: {
  songList: Song[];
  showCover?: boolean;
  showAlbum?: boolean;
}) {
  return (
    <Virtuoso
      useWindowScroll
      customScrollParent={
        document.getElementById("main-scroll-container") as HTMLElement
      }
      data={songList}
      itemContent={(index, song) => (
        <div className="pb-4">
          <SongListItem
            song={song}
            index={index}
            showCover={showCover}
            showAlbum={showAlbum}
          />
        </div>
      )}
    />
  );
}
