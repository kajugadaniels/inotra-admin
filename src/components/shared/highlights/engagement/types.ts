export type HighlightEngagementTab = "likes" | "comments" | "shares";

export type HighlightEngagementFiltersState = {
    search: string;
    highlightId: string;
    userId: string;
    placeId: string;
    eventId: string;
    sort: "desc" | "asc";
    ordering: "created_at";
};

export const defaultHighlightEngagementFilters: HighlightEngagementFiltersState = {
    search: "",
    highlightId: "",
    userId: "",
    placeId: "",
    eventId: "",
    sort: "desc",
    ordering: "created_at",
};

