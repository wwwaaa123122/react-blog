import { useEffect, useState } from "react";
import { profileConfig } from "../config/profile";
import { Icon } from "../components/icons";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";

const ADULT_DATE = new Date("2030-07-20T00:00:00").getTime();

function Countdown() {
  const [text, setText] = useState("");

  useEffect(() => {
    const update = () => {
      const distance = ADULT_DATE - Date.now();
      if (distance <= 0) {
        setText("成年了！🎉🎉🎉");
        return false;
      }
      const days = Math.floor(distance / 86400000);
      const hours = Math.floor((distance % 86400000) / 3600000);
      const minutes = Math.floor((distance % 3600000) / 60000);
      const seconds = Math.floor((distance % 60000) / 1000);
      setText(`${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒`);
      return true;
    };
    update();
    const timer = setInterval(() => {
      if (!update()) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown">
      <p className="countdown-title">成年倒计时</p>
      <p className="countdown-value">{text}</p>
    </div>
  );
}

export default function About() {
  return (
    <>
      <Seo title="关于我" description="认识一下这个博客的主人" path="/about" />
      <Breadcrumb items={[{ label: "关于", to: "/about" }]} />

      <div className="page-header">
        <h1>关于我</h1>
        <p>认识一下这个博客的主人</p>
      </div>

      <div className="card about-card">
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img
            className="avatar"
            style={{ width: 72, height: 72 }}
            src={profileConfig.avatar}
            alt={profileConfig.name}
          />
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>{profileConfig.name}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13.5, marginTop: 4 }}>
              {profileConfig.bio}
            </p>
          </div>
        </div>

        <div className="markdown" style={{ marginTop: 22 }}>
          <p>一个初中生，喜欢折腾技术、打游戏、看番。</p>
          <p>
            这个博客主要分享网络技术、服务器部署、内网穿透、静态网站搭建、CDN
            优化、容器化部署等教程与实践经验，偶尔记录生活。
          </p>
        </div>

        <h3 style={{ marginTop: 26, fontSize: 16, fontWeight: 700 }}>联系我</h3>
        <div className="about-contact">
          <div className="contact-row">
            <img className="contact-avatar" src="/images/qiwei.svg" alt="企业微信" />
            <div>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>企业微信</p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>星辰旅人</p>
            </div>
          </div>
          <div className="contact-row">
            <img className="contact-avatar" src="/images/QQ.svg" alt="QQ" />
            <div>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>QQ</p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>3385016019</p>
            </div>
          </div>
          <div className="contact-row">
            <span className="contact-avatar" style={{ display: "grid", placeItems: "center", background: "var(--primary-soft)", color: "var(--primary)" }}>
              <Icon name="mail" size={20} />
            </span>
            <div>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>邮箱</p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>
                <a href="mailto:i@mcxclr.top">i@mcxclr.top</a>
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a
            className="social-btn"
            href="https://space.bilibili.com/3493078983772353"
            target="_blank"
            rel="noreferrer noopener"
          >
            <Icon name="bilibili" size={16} />
            Bilibili
          </a>
          <a
            className="social-btn"
            href="https://t.me/wwwaaa123122"
            target="_blank"
            rel="noreferrer noopener"
          >
            <Icon name="telegram" size={16} />
            Telegram
          </a>
          <a
            className="social-btn"
            href="https://github.com/wwwaaa123122"
            target="_blank"
            rel="noreferrer noopener"
          >
            <Icon name="github" size={16} />
            GitHub
          </a>
        </div>

        <Countdown />
      </div>
    </>
  );
}
