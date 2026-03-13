import {
  WindowMaterial,
  useMaterial,
} from "@/components/providers/material-provider";
import { Theme, useTheme } from "@/components/providers/theme-provider";
import SettingsExpandar, {
  SettingsExpandarDetail,
} from "@/components/settings/SettingsExpandar";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SONG_QUALITY } from "@/lib/constants/song";
import {
  CheckmarkCircle24Filled,
  CheckmarkStarburst24Regular,
  Color24Regular,
  Speaker224Regular,
  Window24Regular,
} from "@fluentui/react-icons";
import { IconBrandGithub } from "@tabler/icons-react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function SettingPage() {
  return (
    <div className="w-full h-full px-8 py-8 flex flex-col gap-8">
      <div className="w-full h-full flex flex-col gap-4">
        <h2 className="text-sm font-bold">音频</h2>

        <AudioSettingCard />
      </div>

      <div className="w-full h-full flex flex-col gap-4">
        <h2 className="text-sm font-bold">个性化</h2>

        <ThemeSettingCard />
      </div>

      <div className="w-full h-full flex flex-col gap-4">
        <h2 className="text-sm font-bold">关于</h2>
        <div className="flex flex-col gap-2">
          <SettingsExpandar
            title="Yee Music"
            subtitle="更好用的网易云音乐客户端"
            icon={
              <img
                src={"/icons/logo.png"}
                className="object-cover"
                alt="Yee Music"
              />
            }
          >
            <div className="flex flex-col gap-0">
              <SettingsExpandarDetail desc="作者：isen" />
              <SettingsExpandarDetail
                desc="问题反馈"
                trailing={
                  <IconBrandGithub
                    className="size-4 hover:text-muted-foreground text-foreground cursor-pointer"
                    onClick={async () =>
                      await openUrl("https://github.com/1sen3/YeeMusicTauri")
                    }
                  />
                }
              />
            </div>
          </SettingsExpandar>
          <UpdateSettingCard />
        </div>
      </div>
    </div>
  );
}

function AudioSettingCard() {
  return (
    <div className="flex flex-col gap-1">
      <SettingsExpandar
        title="音频质量"
        subtitle="选择优先播放的音质（待实现）"
        icon={<Speaker224Regular />}
        trailing={
          <Combobox value={"无损"}>
            <ComboboxInput className="w-32 select-none! bg-card" />
            <ComboboxContent className="p-2 ring-0">
              <ComboboxList>
                {Object.keys(SONG_QUALITY).map((k) => (
                  <ComboboxItem
                    key={k}
                    value={SONG_QUALITY[k as keyof typeof SONG_QUALITY].desc}
                  >
                    {SONG_QUALITY[k as keyof typeof SONG_QUALITY].desc}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        }
      ></SettingsExpandar>
    </div>
  );
}

function ThemeSettingCard() {
  const { theme, setTheme } = useTheme();
  const { material, setMaterial } = useMaterial();

  const themeStr =
    theme === "system" ? "跟随系统" : theme === "light" ? "浅色" : "深色";

  return (
    <div className="flex flex-col gap-1">
      <SettingsExpandar
        title="主题"
        subtitle="选择 Yee Music 的显示主题"
        icon={<Color24Regular />}
        trailing={
          <span className="text-muted-foreground text-sm">{themeStr}</span>
        }
      >
        <div className="flex flex-col gap-0">
          <SettingsExpandarDetail>
            <div className="w-full flex flex-col items-start">
              <RadioGroup
                defaultValue={theme}
                onValueChange={(val) => setTheme(val as Theme)}
              >
                <div className="flex gap-2 items-center">
                  <RadioGroupItem value="light" />
                  <span>浅色</span>
                </div>
                <div className="flex gap-2 items-center">
                  <RadioGroupItem value="dark" />
                  <span>深色</span>
                </div>
                <div className="flex gap-2 items-center">
                  <RadioGroupItem value="system" />
                  <span>跟随系统</span>
                </div>
              </RadioGroup>
            </div>
          </SettingsExpandarDetail>
        </div>
      </SettingsExpandar>

      <SettingsExpandar
        title="材质"
        subtitle="选择 Yee Music 的窗口材质"
        icon={<Window24Regular />}
        trailing={
          <div className="flex justify-end">
            <Combobox
              value={material}
              onValueChange={(val) => setMaterial(val as WindowMaterial)}
            >
              <ComboboxInput className="w-24 select-none! " />
              <ComboboxContent className="p-2 ring-0">
                <ComboboxList>
                  <ComboboxItem key="acrylic" value="Acrylic">
                    {"Acrylic"}
                  </ComboboxItem>
                  <ComboboxItem key="mica" value="Mica">
                    {"Mica"}
                  </ComboboxItem>
                  <ComboboxItem key="none" value="None">
                    {"None"}
                  </ComboboxItem>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        }
      ></SettingsExpandar>
    </div>
  );
}

function UpdateSettingCard() {
  const [checking, setChecking] = useState(false);
  const [isNewest, setIsNewest] = useState(false);

  async function checkForUpdates() {
    const update = await check();
    if (update) {
      console.log(`found update ${update.version}`);

      let downloaded = 0;
      let contentLength = 0;

      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            contentLength = event.data.contentLength || 0;
            console.log(`started downloading ${contentLength} bytes`);
            break;
          case "Progress":
            downloaded += event.data.chunkLength || 0;
            console.log(`downloaded ${downloaded} from ${contentLength}`);
            break;
          case "Finished":
            console.log("download finished");
            break;
        }
      });

      console.log("update installed");
      await relaunch();
    } else {
      setIsNewest(true);

      setTimeout(() => {
        setIsNewest(false);
      }, 3000);
    }
  }

  async function handleCheck() {
    setChecking(true);
    try {
      await checkForUpdates();
    } catch (e) {
      console.log(`failed to check update: ${e}`);
      toast.error("检查更新失败，请重试...");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="flex flex-col gap-0">
      <SettingsExpandar
        className={cn(isNewest && "rounded-b-none")}
        title="Beta 0.1.6"
        subtitle="上次更新：2026-03-14"
        icon={<CheckmarkStarburst24Regular />}
        trailing={
          <div className="flex justify-end">
            <Button
              className={cn(
                "bg-card text-foreground border-border hover:bg-foreground/2",
                checking && "cursor-not-allowed bg-muted",
              )}
              onClick={handleCheck}
            >
              <div className="flex gap-2">
                {checking && <Spinner />}
                <span>{checking ? "检查中..." : "检查更新"}</span>
              </div>
            </Button>
          </div>
        }
      ></SettingsExpandar>
      {isNewest && (
        <div className="bg-green-400/25 rounded-b-md border-t-0 border-border p-4 flex items-center gap-2 text-sm">
          <CheckmarkCircle24Filled className="text-green-600" />
          已更新到最新版本
        </div>
      )}
    </div>
  );
}
