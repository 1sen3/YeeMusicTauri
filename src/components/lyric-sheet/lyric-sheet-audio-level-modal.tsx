import { SONG_QUALITY } from "@/lib/constants/song";
import { usePlayerStore } from "@/lib/store/playerStore";
import {
  YeeDialog,
  YeeDialogCloseButton,
  YeeDialogPrimaryButton,
} from "../yee-dialog";
import { cn, formatFileSize } from "@/lib/utils";

import { MusicLevelPopover } from "../music-level-popover";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LyricSheetAudioLevelModel({
  setIsLyricSheetOpen,
}: {
  setIsLyricSheetOpen: (isOpen: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { currentMusicLevel, currentSongMusicDetail } = usePlayerStore();

  const isUnlock = currentMusicLevel === "unlock";

  const navigate = useNavigate();

  return (
    <YeeDialog
      title="音频质量"
      asForm={false}
      trigger={
        <div className="border-0 bg-white/10 text-white/80 rounded-sm drop-shadow-md hover:bg-white/20 font-semibold px-2 py-1 text-xs cursor-pointer">
          {SONG_QUALITY[currentMusicLevel].desc}
        </div>
      }
      footer={
        <div className="w-full flex gap-2">
          <YeeDialogPrimaryButton
            className="bg-card hover:bg-card/80 text-foreground"
            onClick={() => {
              navigate("/setting");
              setIsLyricSheetOpen(false);
            }}
          >
            详细设置
          </YeeDialogPrimaryButton>
          <YeeDialogCloseButton className="bg-primary hover:bg-primary/80 text-white">
            好
          </YeeDialogCloseButton>
        </div>
      }
    >
      <div className="flex flex-col gap-2 px-4 pt-6 justify-start">
        <MusicLevelPopover
          side="bottom"
          sideOffset={16}
          variant="dark"
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <div className="flex justify-between items-center hover:bg-white/10 cursor-pointer p-4 -mx-4 -mt-4 rounded-xl">
            <span className="text-lg font-semibold">
              {SONG_QUALITY[currentMusicLevel].desc}
            </span>
            <ChevronDown
              className={cn(
                isOpen && "rotate-180",
                "transition-transform duration-300 ease-in-out",
              )}
            />
          </div>
        </MusicLevelPopover>
        <span className="text-lg text-foreground/60">
          {!isUnlock &&
            formatFileSize(
              currentSongMusicDetail.find(
                (detail) => detail.key === currentMusicLevel,
              )?.size || 0,
            )}
        </span>
      </div>
    </YeeDialog>
  );
}
