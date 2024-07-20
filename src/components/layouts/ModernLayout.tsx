import Header from "@/components/template/Header";
import UserDropdown from "@/components/template/UserDropdown";
import SideNavToggle from "@/components/template/SideNavToggle";
import MobileNav from "@/components/template/MobileNav";
import SideNav from "@/components/template/SideNav";
import View from "@/views";
import Search from "../template/Search";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const HeaderActionsStart = () => {
  return (
    <>
      <MobileNav />
      <SideNavToggle />
      <Search />
    </>
  );
};

const HeaderActionsEnd = () => {
  const { t } = useTranslation("dashboard");
  return (
    <>/
      <UserDropdown hoverable={false} />
    </>
  );
};

const ModernLayout = () => {
  const [isConsentPage, setIsConsentPage] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("/consent/")) {
      setIsConsentPage(true);
    }
  }, [location.pathname]);

  return (
    <div className="app-layout-modern flex flex-auto flex-col">
      <div className="flex flex-auto min-w-0">
        {isConsentPage ? null : <SideNav />}

        <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full bg-white dark:bg-gray-800 border-l rtl:border-r border-gray-200 dark:border-gray-700">
          {isConsentPage ? null : (
            <Header
              className="border-b border-gray-200 dark:border-gray-700"
              headerEnd={<HeaderActionsEnd />}
              headerStart={<HeaderActionsStart />}
            />
          )}
          <View />
        </div>
      </div>
    </div>
  );
};

export default ModernLayout;
