"use client";

import { useMemo } from "react";

import { getApiBaseUrl } from "@/config/api";
import AdminChatsPageClient from "@/components/shared/chats/AdminChatsPageClient";

const ChatsPage = () => {
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
    return <AdminChatsPageClient apiBaseUrl={apiBaseUrl} />;
};

export default ChatsPage;

