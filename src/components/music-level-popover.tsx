import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { SONG_QUALITY } from "@/lib/constants/song";
import { cn, formatFileSize } from "@/lib/utils";
import { Checkmark24Filled } from "@fluentui/react-icons";
import { usePlayerStore } from "@/lib/store/playerStore";
import { QualityWithKey } from "@/lib/types/song";
import { ReactNode } from "react";
import { cva } from "class-variance-authority";

const popoverVarients = cva("w-64 rounded-lg", {
  variants: {
    variant: {
      dark: "bg-black text-white border-white/20",
      light: "bg-white/90 text-black backdrop-blur-md",
    },
  },
});

export function MusicLevelPopover({
  open,
  onOpenChange,
  variant,
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
              "cursor-pointer bg-card hover:bg-card/50 rounded-full px-2 py-1 text-sm font-bold text-foreground/60",
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
        className={cn(popoverVarients({ variant }), contentClassName)}
      >
        {isUnlock ? (
          <div className="text-center">灰色音源歌曲不支持修改音质</div>
        ) : (
          <ul className="flex flex-col gap-2">
            {currentSongMusicDetail.map(
              (quality: QualityWithKey) =>
                Object.keys(SONG_QUALITY).includes(quality.key) && (
                  <AudioLevelItem
                    variant={variant}
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
  variant?: "light" | "dark";
  level: keyof typeof SONG_QUALITY;
  size: string;
  selected?: boolean;
  onClick: (level: string) => void;
}

export function AudioLevelItem({
  variant,
  level,
  size,
  selected = false,
  onClick,
}: AudioLevelItemProps) {
  return (
    <div
      className={cn(
        "flex justify-between items-center  px-4 py-2 rounded-md cursor-pointer",
        variant === "light" ? "hover:bg-black/5" : "hover:bg-white/20",
      )}
      onClick={() => onClick(level)}
    >
      <span className="font-semibold">{SONG_QUALITY[level].desc}</span>

      <div className="flex gap-2 items-center">
        <span
          className={cn(
            variant === "light" ? "text-black/60" : "text-white/60",
          )}
        >
          {size}
        </span>
        {selected && <Checkmark24Filled className="size-4" />}
      </div>
    </div>
  );
}
