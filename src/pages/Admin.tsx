import { siteConfig } from "../config/site";
import { Icon } from "../components/icons";
import Seo from "../components/Seo";
import Breadcrumb from "../components/Breadcrumb";

const PAGES_CMS_URL = "https://app.pagescms.org/";

export default function Admin() {
  return (
    <>
      <Seo title="后台管理" path="/admin" noindex />
      <Breadcrumb items={[{ label: "管理", to: "/admin" }]} />

      <div className="page-header">
        <h1>后台管理</h1>
        <p>通过 Pages CMS 在线编辑文章、个人资料与友链，保存后自动提交并触发部署</p>
      </div>

      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 20px",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "var(--primary-soft)",
              color: "var(--primary)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name="user" size={18} />
          </span>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14.5 }}>
              Pages CMS · {siteConfig.title}
            </p>
            <p style={{ fontSize: 12.5, color: "var(--text-tertiary)" }}>
              内容保存在仓库中，由 GitHub Actions 自动构建部署
            </p>
          </div>
        </div>
        <a
          className="btn btn-primary"
          href={PAGES_CMS_URL}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Icon name="external" size={15} />
          新窗口打开后台
        </a>
      </div>

      <div
        className="card"
        style={{ overflow: "hidden", height: "72vh", minHeight: 480 }}
      >
        <iframe
          src={PAGES_CMS_URL}
          title="Pages CMS"
          style={{ width: "100%", height: "100%", border: "none" }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>

      <div className="card" style={{ padding: "24px 28px", marginTop: 16 }}>
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 15.5,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          <Icon name="link" size={17} />
          使用说明
        </h3>
        <ol className="step-list">
          <li>
            <span className="step-num">1</span>
            <div>
              <p className="step-title">登录 GitHub</p>
              <p className="step-desc">
                在后台使用 GitHub 账号登录，并安装 Pages CMS GitHub App 到本仓库
              </p>
            </div>
          </li>
          <li>
            <span className="step-num">2</span>
            <div>
              <p className="step-title">选择仓库</p>
              <p className="step-desc">
                打开部署本博客的仓库（仓库根目录已有 <code style={{ fontSize: 12 }}>.pages.yml</code> 配置）
              </p>
            </div>
          </li>
          <li>
            <span className="step-num">3</span>
            <div>
              <p className="step-title">编辑内容</p>
              <p className="step-desc">
                文章（src/posts）、个人资料（src/data/profile.json）、友链（src/data/friends.json）、站点配置（src/data/site.json）
              </p>
            </div>
          </li>
          <li>
            <span className="step-num">4</span>
            <div>
              <p className="step-title">保存发布</p>
              <p className="step-desc">
                每次保存会自动提交到仓库，GitHub Actions 检测到推送后自动重新构建并部署站点
              </p>
            </div>
          </li>
        </ol>
      </div>
    </>
  );
}
