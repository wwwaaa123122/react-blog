import type { SocialLink } from "../types";
import profileData from "../data/profile.json";

export const profileConfig = {
  avatar: profileData.avatar,
  name: profileData.name,
  bio: profileData.bio,
  links: profileData.links as SocialLink[],
};
