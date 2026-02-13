import { requestJson } from "@/api/http";
import type { BasicMessageResponse, EventSubmissionListItem } from "@/api/types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    submissionId: string;
    status: "APPROVED" | "REJECTED";
    rejection_reason?: string;
};

type Response = BasicMessageResponse & {
    submission?: EventSubmissionListItem;
};

export function updateEventSubmissionStatus({
    apiBaseUrl,
    accessToken,
    submissionId,
    status,
    rejection_reason,
}: Args) {
    return requestJson<Response>({
        apiBaseUrl,
        path: `/event-submissions/${submissionId}/status/`,
        method: "PATCH",
        accessToken,
        body: {
            status,
            rejection_reason: rejection_reason?.trim() || undefined,
        },
    });
}

