import AdPlacementsDataProvider from "@/components/shared/ads/placements/AdPlacementsData";
import AdPlacementsPage from "@/components/shared/ads/placements/AdPlacementsPage";

const AdPlacementsPageLayout = () => {
    return (
        <AdPlacementsDataProvider>
            <AdPlacementsPage />
        </AdPlacementsDataProvider>
    );
};

export default AdPlacementsPageLayout;
