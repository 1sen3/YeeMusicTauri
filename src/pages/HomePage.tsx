import { useEffect } from "react";
import { HomeBlock, RecentListenListData } from "@/lib/types";
import { Section } from "@/components/home/section";
import { SongPreview } from "@/components/home/song-preview";
import {
  getHomepageData,
  getRecentListenListData,
} from "@/lib/services/homepage";
import { PlaylistCard } from "../components/home/playlist-card";
import { VoicePreview } from "../components/home/voice-preview";
import { Loading } from "@/components/loading";
import { useTitlebar } from "@/contexts/titlebar-context";
import { SlideAndFadePage } from "@/components/slide-and-fade-page";
import useSWR from "swr";
import { RecentListenSection } from "@/components/home/recent-listen-section";
import { useUserStore } from "@/lib/store/userStore";

export default function Page() {
  const { setOnRefresh, setIsRefreshing } = useTitlebar();
  const { isLoggedin } = useUserStore();

  const {
    data: homepageData,
    isLoading: isLoadingHomepage,
    mutate: mutateHomepage,
  } = useSWR<HomeBlock[]>("homepage", () => getHomepageData(true), {
    revalidateOnFocus: false,
  });

  const {
    data: recentListenList,
    isLoading: isLoadingRecent,
    mutate: mutateRecent,
  } = useSWR<RecentListenListData | null>(
    "recentListen",
    getRecentListenListData,
    {
      revalidateOnFocus: false,
    },
  );

  const isLoading = isLoadingHomepage || isLoadingRecent;

  // 当登录状态变化时自动刷新
  useEffect(() => {
    mutateHomepage();
    mutateRecent();
  }, [isLoggedin, mutateHomepage, mutateRecent]);

  // 注册刷新回调
  useEffect(() => {
    setOnRefresh(async () => {
      setIsRefreshing(true);
      try {
        await Promise.all([mutateHomepage(), mutateRecent()]);
      } finally {
        setIsRefreshing(false);
      }
    });
    return () => setOnRefresh(null);
  }, [setOnRefresh, setIsRefreshing, mutateHomepage, mutateRecent]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full min-h-full h-full px-8 py-8 flex flex-col gap-12">
          {recentListenList && (
            <RecentListenSection resources={recentListenList.resources} />
          )}

          {homepageData?.map((blocks, idx) => (
            <SlideAndFadePage key={idx}>
              <Section
                title={blocks.uiElement?.subTitle?.title || ""}
                itemsPerPage={
                  blocks.showType === "HOMEPAGE_SLIDE_SONGLIST_ALIGN" ||
                  blocks.showType === "HOMPAGE_VIP_SONG_RCMD"
                    ? 2
                    : undefined
                }
                seeMore={blocks?.uiElement?.button?.text.includes("更多")}
              >
                {blocks.showType === "HOMEPAGE_SLIDE_PLAYLIST" &&
                  blocks?.creatives?.map((creative) => (
                    <PlaylistCard
                      resource={creative?.resources?.[0] || null}
                      key={creative.creativeId}
                    />
                  ))}

                {(blocks.showType === "HOMEPAGE_SLIDE_SONGLIST_ALIGN" ||
                  blocks.showType === "HOMPAGE_VIP_SONG_RCMD") &&
                  blocks?.creatives?.map((creative, idx) => (
                    <SongPreview
                      key={`${creative.creativeId}-${idx}`}
                      resources={creative.resources!}
                    />
                  ))}

                {blocks.showType === "SLIDE_RCMDLIKE_VOICELIST" &&
                  blocks?.creatives && (
                    <>
                      <VoicePreview creatives={blocks.creatives.slice(0, 3)} />
                      <VoicePreview creatives={blocks.creatives.slice(3, 6)} />
                    </>
                  )}
              </Section>
            </SlideAndFadePage>
          ))}
        </div>
      )}
    </>
  );
}
