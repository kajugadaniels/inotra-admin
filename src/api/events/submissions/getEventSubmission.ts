import { requestJson } from "@/api/http";
import type { EventSubmissionDetail } from "@/api/types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    submissionId: string;
};

export function getEventSubmission({
    apiBaseUrl,
    accessToken,
    submissionId,
}: Args) {
    return requestJson<EventSubmissionDetail>({
        apiBaseUrl,
        path: `/event-submissions/${submissionId}/`,
        method: "GET",
        accessToken,
    });
}

