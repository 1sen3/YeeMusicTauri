import { RecentListenResource } from "@/lib/types";
import ChromaGrid from "@/components/ChromaGrid";
import { Vibrant } from "node-vibrant/browser";
import { useEffect, useState } from "react";
import { usePlayerStore } from "@/lib/store/playerStore";
import { GetThumbnail } from "@/lib/utils";

export function RecentListenSection({
  resources,
}: {
  resources: RecentListenResource[];
}) {
  const [items, setItems] = useState<any[]>([]);
  const { playList } = usePlayerStore();

  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      const processedItems = await Promise.all(
        resources.map(async (res) => {
          const cover = GetThumbnail(res.coverUrlList?.[0]);
          const typeLink =
            res.resourceType === "list" ? "playlist" : res.resourceType;
          let coverColor = "black",
            coverColor2 = "black";
          const url = `/detail/${typeLink}?id=${res.resourceId}`;

          if (cover) {
            try {
              const v = new Vibrant(cover);
              const palette = await v.getPalette();
              coverColor = palette.LightVibrant?.hex || "black";
              coverColor2 = palette.DarkMuted?.hex || "black";
            } catch (error) {
              console.error("Failed to extract color", error);
            }
          }

          return {
            image: cover,
            title: res.title,
            subtitle: res.tag,
            handle: res.playOrUpdateTime,
            borderColor: coverColor,
            gradient: `linear-gradient(180deg, ${coverColor}, ${coverColor2})`,
            url: url,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              if (res?.resourceId) playList(res?.resourceId, res.resourceType);
            },
          };
        }),
      );

      if (isMounted) {
        setItems(processedItems);
      }
    };

    loadItems();

    return () => {
      isMounted = false;
    };
  }, [resources]);

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">
        <div className="flex items-center gap-2 group transform transition duration-300 ease-in-out">
          最近常听
        </div>
      </h2>
      <ChromaGrid
        items={items}
        radius={300}
        damping={0.45}
        fadeOut={0.6}
        ease="power3.out"
      />
    </div>
  );
}
