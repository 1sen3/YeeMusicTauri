import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PlayerBar } from "@/components/playerbar/playerbar";
import { Toaster } from "@/components/ui/sonner";
import { AuthConfig } from "@/components/providers/auth-provider";
import { Titlebar } from "@/components/titlebar/titlebar";
import { TitlebarProvider } from "@/contexts/titlebar-context";
import { cn } from "@/lib/utils";

export default function RootLayout() {
  return (
    <div
      className={cn(
        "font-sans antialiased h-screen flex flex-col overflow-hidden select-none",
      )}
    >
      <AuthConfig />
      <TitlebarProvider>
        <SidebarProvider className="flex w-full h-full flex-col overflow-hidden min-h-0!">
          <div className="w-full shrink-0 z-50">
            <Suspense>
              <Titlebar />
            </Suspense>
          </div>

          <div className="flex-1 w-full overflow-hidden flex relative">
            <Suspense fallback={null}>
              <AppSidebar />
            </Suspense>

            <div className="relative flex flex-col flex-1 overflow-hidden bg-card/60 border border-border rounded-tl-lg border-b-0">
              <main
                id="main-scroll-container"
                className="flex-1 w-full h-full overflow-y-auto"
              >
                <div className="W-full flex flex-col">
                  <Outlet />
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </TitlebarProvider>
      <Toaster />
      <div className="w-full z-40">
        <PlayerBar />
      </div>
    </div>
  );
}
