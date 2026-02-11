import { requestJson } from "@/api/http";
import type { BasicMessageResponse, ListingSubmissionListItem } from "@/api/types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    submissionId: string;
    status: "APPROVED" | "REJECTED";
    rejection_reason?: string;
};

type Response = BasicMessageResponse & {
    submission?: ListingSubmissionListItem;
};

export function updateListingSubmissionStatus({
    apiBaseUrl,
    accessToken,
    submissionId,
    status,
    rejection_reason,
}: Args) {
    return requestJson<Response>({
        apiBaseUrl,
        path: `/listing-submissions/${submissionId}/status/`,
        method: "PATCH",
        accessToken,
        body: {
            status,
            rejection_reason: rejection_reason?.trim() || undefined,
        },
    });
}
