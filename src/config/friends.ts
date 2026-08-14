import type { FriendLink } from "../types";
import friendsData from "../data/friends.json";

export const friendsConfig: FriendLink[] = friendsData.list as FriendLink[];

export const getEnabledFriends = (): FriendLink[] =>
  friendsConfig
    .filter((f) => f.enabled)
    .sort((a, b) => b.weight - a.weight);

// 本站信息（友链申请用）
export const siteInfo = friendsData.siteInfo;

export const friendNotes = friendsData.notes;

export const friendTemplate: string = friendsData.template;
