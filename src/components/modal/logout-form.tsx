import { logout } from "@/lib/services/auth";
import { useUserStore } from "@/lib/store/userStore";
import { toast } from "sonner";
import {
  YeeDialog,
  YeeDialogCloseButton,
  YeeDialogPrimaryButton,
} from "../yee-dialog";
import { useTheme } from "../providers/theme-provider";

export function LogoutForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { theme } = useTheme();

  const storeLogout = useUserStore((state) => state.logout);

  async function handleLogout() {
    try {
      await logout();
      storeLogout();
      onOpenChange?.(false);
      toast("退出登录成功", { position: "top-right" });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <YeeDialog
      open={open}
      onOpenChange={onOpenChange}
      title="退出登录"
      showTitle={true}
      footer={
        <div className="w-full flex gap-2">
          <YeeDialogCloseButton variant={theme === "dark" ? "dark" : "light"}>
            取消
          </YeeDialogCloseButton>
          <YeeDialogPrimaryButton
            onClick={handleLogout}
            variant={theme === "dark" ? "dark" : "light"}
            className="bg-destructive hover:bg-destructive/80"
          >
            确定
          </YeeDialogPrimaryButton>
        </div>
      }
      variant={theme === "dark" ? "dark" : "light"}
    >
      <span>确定要退出登录吗？</span>
    </YeeDialog>
  );
}
