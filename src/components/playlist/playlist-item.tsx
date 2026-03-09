import { Playlist } from "@/lib/types";
import { Play24Filled } from "@fluentui/react-icons";
import { usePlayerStore } from "@/lib/store/playerStore";
import { Link } from "react-router-dom";
import { YeeButton } from "../yee-button";

export function PlaylistItem({ playlist }: { playlist: Playlist }) {
  const playList = usePlayerStore((s) => s.playList);

  return (
    <div className="flex gap-4">
      <div className="size-24 relative rounded-md overflow-hidden drop-shadow-md cursor-pointer group">
        <Link to={`/detail/playlist?id=${playlist.id}`}>
          <img
            src={playlist.coverImgUrl!}
            alt={`${playlist.name} cover`}
            className="group-hover:brightness-60 transition-all duration-300 object-cover"
          />
        </Link>
      </div>
      <div className="flex flex-col justify-between items-start">
        <div className="flex flex-col">
          <span className="font-semibold text-md">{playlist.name}</span>
          <span className="text-foreground/60 text-sm">
            {playlist.creator.nickname}
          </span>
        </div>
        <YeeButton
          variant="outline"
          className="bg-white"
          icon={<Play24Filled className="size-4" />}
          onClick={() => playList(playlist.id, "list")}
        />
      </div>
    </div>
  );
}
