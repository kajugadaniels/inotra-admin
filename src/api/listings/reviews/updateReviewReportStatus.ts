import { requestJson } from "@/api/http";
import type { ReviewReport } from "@/api/types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    reportId: string;
    status: string;
};

export function updateReviewReportStatus({ apiBaseUrl, accessToken, reportId, status }: Args) {
    return requestJson<{ message: string; report: ReviewReport }>({
        apiBaseUrl,
        path: `/review-report/${reportId}/status/`,
        method: "PATCH",
        accessToken,
        body: { status },
    });
}
