import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { SONG_QUALITY } from "@/lib/constants/song";
import { cn, formatFileSize } from "@/lib/utils";
import { usePlayerStore } from "@/lib/store/playerStore";
import { QualityWithKey } from "@/lib/types/song";
import { ReactNode } from "react";

export function MusicLevelPopover({
  open,
  onOpenChange,
  side = "top",
  sideOffset = 48,
  contentClassName,
  className,
  children,
}: {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  variant?: "light" | "dark";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  contentClassName?: string;
  className?: string;
  children?: ReactNode;
}) {
  const { currentMusicLevel, currentSongMusicDetail, setCurrentMusicLevel } =
    usePlayerStore();

  function handleSetMusicLevel(level: string) {
    if (level in SONG_QUALITY) {
      setCurrentMusicLevel(level as keyof typeof SONG_QUALITY);
    }
  }

  const isUnlock = currentMusicLevel === "unlock";

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild={!!children}>
        {children ? (
          children
        ) : (
          <span
            className={cn(
              "cursor-pointer bg-card/50 hover:bg-card/30 rounded-md px-2 py-1 text-xs font-bold text-foreground/60 border",
              className,
            )}
          >
            {SONG_QUALITY[currentMusicLevel].desc}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent
        side={side}
        sideOffset={sideOffset}
        className={cn("w-64 rounded-lg", contentClassName)}
      >
        {isUnlock ? (
          <div className="text-center">灰色音源歌曲不支持修改音质</div>
        ) : (
          <ul className="flex flex-col gap-2">
            {currentSongMusicDetail.map(
              (quality: QualityWithKey) =>
                Object.keys(SONG_QUALITY).includes(quality.key) && (
                  <AudioLevelItem
                    key={quality.key}
                    level={quality.key as keyof typeof SONG_QUALITY}
                    size={formatFileSize(quality.size)}
                    selected={quality.key === currentMusicLevel}
                    onClick={handleSetMusicLevel}
                  />
                ),
            )}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}

interface AudioLevelItemProps {
  level: keyof typeof SONG_QUALITY;
  size: string;
  selected?: boolean;
  onClick: (level: string) => void;
}

export function AudioLevelItem({
  level,
  size,
  selected = false,
  onClick,
}: AudioLevelItemProps) {
  return (
    <div
      className={cn(
        "relative flex justify-between items-center  px-4 py-2 rounded-md cursor-pointer hover:bg-muted",
        selected && "bg-muted",
      )}
      onClick={() => onClick(level)}
    >
      <span className="font-semibold">{SONG_QUALITY[level].desc}</span>

      <div className="flex gap-2 items-center">
        <span className={cn("text-foreground/60")}>{size}</span>
        {selected && (
          <span className="w-1 h-4 bg-primary absolute left-0 -translate-1/2 top-1/2 rounded-full"></span>
        )}
      </div>
    </div>
  );
}
