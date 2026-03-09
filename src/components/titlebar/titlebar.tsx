import {
  ArrowClockwise24Regular,
  ArrowLeft24Filled,
  ArrowRight24Filled,
  Dismiss24Regular,
  Maximize24Regular,
  Navigation24Filled,
  SquareMultiple24Regular,
  Subtract24Regular,
} from "@fluentui/react-icons";
import { Button } from "../ui/button";
import { useTitlebar } from "@/contexts/titlebar-context";
import { cn } from "@/lib/utils";
import { SearchInput } from "./search-input";
import { useAppWindow } from "@/hooks/use-app-window";
import { useSidebar } from "../ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { YeeButton } from "../yee-button";
import { useRef } from "react";

export function Titlebar() {
  const navigate = useNavigate();
  const { canGoBack, canGoForward } = useNavigationHistory();
  const { onRefresh, isRefreshing } = useTitlebar();
  const { minimize, toogleMaximize, close, isMaximized, startDragging } =
    useAppWindow();

  const handleRefresh = () => {
    if (onRefresh && !isRefreshing) {
      onRefresh();
    }
  };

  const MaxmizeIcon = isMaximized ? SquareMultiple24Regular : Maximize24Regular;

  const { toggleSidebar } = useSidebar();

  const lastClickTimeRef = useRef(0);

  return (
    <div
      className="w-full h-12 top-0 z-50 flex items-center pr-0"
      onMouseDown={(e) => {
        if (e.button !== 0) return;
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTimeRef.current;
        if (timeDiff < 300) {
          toogleMaximize();
          lastClickTimeRef.current = 0;
        } else {
          lastClickTimeRef.current = currentTime;
          startDragging();
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex items-center gap-2 pl-3 flex-1 shrink-0 min-w-0">
        <YeeButton
          variant="ghost"
          className="cursor-pointer shrink-0 hover:bg-foreground/5 rounded-sm size-6"
          icon={<Navigation24Filled className="size-4" />}
          onClick={toggleSidebar}
          onMouseDown={(e) => e.stopPropagation()}
        />

        <YeeButton
          variant="ghost"
          className="cursor-pointer shrink-0 hover:bg-foreground/5 rounded-sm size-6"
          icon={<ArrowLeft24Filled className="size-4" />}
          disabled={!canGoBack}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => navigate(-1)}
        />

        <YeeButton
          variant="ghost"
          className="cursor-pointer shrink-0 hover:bg-foreground/5 rounded-sm size-6"
          icon={<ArrowRight24Filled className="size-4" />}
          disabled={!canGoForward}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => navigate(1)}
        />

        <div className="flex items-center gap-2 truncate group-data-[collapsible=icon]:hidden shrink-0">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <img
              src="/icons/logo.png"
              alt="Yee Music Logo"
              width={20}
              height={20}
              className="rounded-sm"
            />
          </div>
          <span className="truncate font-medium text-sm text-foreground">
            Yee Music
          </span>
          <span className="text-xs font-bold bg-pink-200 rounded-sm px-1 text-muted-foreground">
            dev
          </span>
        </div>
      </div>

      <div className="flex flex-1 justify-center shrink-0 min-w-[200px]">
        <div onMouseDown={(e) => e.stopPropagation()}>
          <SearchInput />
        </div>
      </div>

      <div className="flex items-center justify-end flex-1 shrink-0">
        {onRefresh && (
          <YeeButton
            variant="ghost"
            className="cursor-pointer shrink-0 hover:bg-foreground/5 rounded-sm size-6 mr-2"
            icon={
              <ArrowClockwise24Regular
                className={cn(isRefreshing && "animate-spin")}
              />
            }
            onClick={handleRefresh}
            disabled={isRefreshing}
            onMouseDown={(e) => e.stopPropagation()}
          />
        )}
        <Button
          className="cursor-pointer h-12 w-12 rounded-none border-0 hover:bg-black/5"
          variant="ghost"
          size="icon"
          onClick={minimize}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Subtract24Regular />
        </Button>
        <Button
          className="cursor-pointer h-12 w-12 rounded-none border-0 hover:bg-black/5"
          variant="ghost"
          size="icon"
          onClick={toogleMaximize}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <MaxmizeIcon />
        </Button>
        <Button
          className="cursor-pointer h-12 w-12 rounded-tr-lg rounded-none hover:bg-destructive hover:text-white border-0"
          variant="ghost"
          size="icon"
          onClick={close}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Dismiss24Regular />
        </Button>
      </div>
    </div>
  );
}
