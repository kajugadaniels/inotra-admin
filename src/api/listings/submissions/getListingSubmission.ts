import { requestJson } from "@/api/http";
import type { ListingSubmissionDetail } from "@/api/types";

type Args = {
    apiBaseUrl: string;
    accessToken: string;
    submissionId: string;
};

export function getListingSubmission({
    apiBaseUrl,
    accessToken,
    submissionId,
}: Args) {
    return requestJson<ListingSubmissionDetail>({
        apiBaseUrl,
        path: `/listing-submissions/${submissionId}/`,
        method: "GET",
        accessToken,
    });
}

