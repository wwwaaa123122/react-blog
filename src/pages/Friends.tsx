import { useState } from "react";
import {
  getEnabledFriends,
  siteInfo,
  friendNotes,
  friendTemplate,
} from "../config/friends";
import { Icon } from "../components/icons";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button className="copy-btn" onClick={copy} aria-label="复制" title="复制">
      <Icon name={copied ? "check" : "copy"} size={14} />
    </button>
  );
}

export default function Friends() {
  const friends = getEnabledFriends();

  return (
    <>
      <Seo
        title="友链"
        description="友情链接与友链申请方式，与优秀的朋友们一起成长"
        path="/friends"
      />
      <Breadcrumb items={[{ label: "友链", to: "/friends" }]} />

      <div className="page-header">
        <h1>友链</h1>
        <p>与优秀的朋友们一起成长</p>
      </div>

      {/* 申请信息 */}
      <div className="info-grid">
        <div className="card info-card">
          <h3>
            <Icon name="link" size={18} />
            本站信息
          </h3>
          {[
            { label: "站点名称", value: siteInfo.name },
            { label: "站点描述", value: siteInfo.desc },
            { label: "站点链接", value: siteInfo.url },
            { label: "头像链接", value: siteInfo.avatar },
          ].map((item) => (
            <div className="info-row" key={item.label}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p className="info-row-label">{item.label}</p>
                <p className="info-row-value" title={item.value}>
                  {item.value}
                </p>
              </div>
              <CopyButton text={item.value} />
            </div>
          ))}
        </div>

        <div className="card info-card">
          <h3>
            <Icon name="user" size={18} />
            申请友链
          </h3>
          <ul className="step-list">
            <li>
              <span className="step-num">1</span>
              <div>
                <p className="step-title">添加本站友链</p>
                <p className="step-desc">
                  请先在您的网站友链页面添加本站信息，可直接复制左侧各字段
                </p>
              </div>
            </li>
            <li>
              <span className="step-num">2</span>
              <div>
                <p className="step-title">
                  评论区留言或发送申请邮件至{" "}
                  <code
                    style={{
                      padding: "1px 6px",
                      borderRadius: 5,
                      background: "var(--code-bg)",
                      border: "1px solid var(--line-divider)",
                      fontSize: 12,
                    }}
                  >
                    {siteInfo.email}
                  </code>
                </p>
                <p className="step-desc">复制下方模板，修改后发送</p>
                <div className="template-block">
                  {friendTemplate}
                  <CopyButton text={friendTemplate} />
                </div>
              </div>
            </li>
            <li>
              <span className="step-num">3</span>
              <div>
                <p className="step-title">等待审核</p>
                <p className="step-desc">确认信息无误后会尽快添加您的友链</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="card notes-card">
        <h3>
          <Icon name="tag" size={18} />
          注意事项
        </h3>
        {friendNotes.map((note) => (
          <div className="note-item" key={note.title}>
            <span className="note-dot" />
            <p>
              <strong>{note.title}</strong>：{note.content}
            </p>
          </div>
        ))}
      </div>

      {/* 友链列表 */}
      <h2 className="section-title">
        友链列表（{friends.length}）
      </h2>
      <div className="friends-grid">
        {friends.map((f) => (
          <a
            key={f.title}
            className="card card-hover friend-card"
            href={f.siteurl}
            target="_blank"
            rel="noreferrer noopener"
          >
            {f.imgurl ? (
              <img className="friend-avatar" src={f.imgurl} alt={f.title} loading="lazy" />
            ) : (
              <span className="friend-avatar friend-fallback">
                {f.title.charAt(0)}
              </span>
            )}
            <div style={{ minWidth: 0 }}>
              <p className="friend-title">
                {f.title}
                <Icon name="external" size={12} />
              </p>
              <p className="friend-desc">{f.desc}</p>
              {f.tags.length > 0 && (
                <div className="friend-tags">
                  {f.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
