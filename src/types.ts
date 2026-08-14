export interface Post {
  slug: string;
  title: string;
  published: string;
  description: string;
  image?: string;
  tags: string[];
  category: string;
  draft: boolean;
  lang: string;
  content: string;
  words: number;
}

export interface FriendLink {
  title: string;
  imgurl: string;
  desc: string;
  siteurl: string;
  tags: string[];
  weight: number;
  enabled: boolean;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: "github" | "x" | "telegram" | "mail" | "bilibili";
}

export interface NavLink {
  name: string;
  to?: string;
  url?: string;
  external?: boolean;
}
