import { Link } from "react-router-dom";
import { Icon } from "../components/icons";

export default function NotFound() {
  return (
    <div className="notfound">
      <p className="notfound-code">404</p>
      <p className="notfound-title">页面飞走了 🦋</p>
      <p className="notfound-desc">你访问的页面不存在或已被移除</p>
      <div className="notfound-actions">
        <Link className="btn btn-primary" to="/">
          <Icon name="home" size={16} />
          回到首页
        </Link>
        <Link className="btn btn-ghost" to="/posts">
          <Icon name="book" size={16} />
          浏览文章
        </Link>
      </div>
    </div>
  );
}
