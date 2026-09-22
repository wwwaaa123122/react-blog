// /components 预览页的示例单元。
// 约定：每格只演示「一个 shadcn/ui 组件」的典型用法，全部使用 src/components/ui 下的
// 组件库实现，不含任何手写样式型控件（手写样式统一收敛在 ui 目录内）。
// 注意：本文件会被预渲染（react-dom/server），必须保持 SSR 安全（不在模块顶层访问 window）。
import * as React from "react"
import {
  AlertCircleIcon,
  ArrowRightIcon,
  BellIcon,
  BookmarkIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CloudIcon,
  CopyIcon,
  CreditCardIcon,
  DatabaseIcon,
  DownloadIcon,
  FileTextIcon,
  CodeIcon,
  HeartIcon,
  HomeIcon,
  InboxIcon,
  InfoIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  Loader2Icon,
  LogOutIcon,
  MailIcon,
  MinusIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RocketIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  StarIcon,
  TrashIcon,
  TrendingUpIcon,
  TriangleAlertIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"
import { ButtonGroup } from "@/components/ui/button-group"

export interface DemoCell {
  /** 组件名（英文，与 ui 目录文件名一致） */
  name: string
  /** 中文说明 */
  label?: string
  /** 示例内容 */
  demo: React.ReactNode
}

export const demoCells: DemoCell[] = [
  {
    name: "Button",
    label: "变体",
    demo: (
      <div className="flex flex-wrap items-center gap-2">
        <Button>主要</Button>
        <Button variant="secondary">次要</Button>
        <Button variant="outline">描边</Button>
        <Button variant="ghost">幽灵</Button>
        <Button variant="destructive">危险</Button>
        <Button variant="link">链接</Button>
      </div>
    ),
  },
  {
    name: "Button",
    label: "尺寸与图标",
    demo: (
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">xs</Button>
        <Button size="sm">sm</Button>
        <Button size="default">default</Button>
        <Button size="lg">lg</Button>
        <Button size="icon" aria-label="搜索">
          <SearchIcon />
        </Button>
        <Button disabled>
          <Loader2Icon className="animate-spin" />
          处理中
        </Button>
        <Button>
          继续
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </div>
    ),
  },
  {
    name: "ButtonGroup",
    label: "按钮组",
    demo: (
      <div className="flex flex-col items-start gap-2">
        <ButtonGroup>
          <Button variant="outline">日</Button>
          <Button variant="outline">周</Button>
          <Button variant="outline">月</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" size="icon" aria-label="撤销">
            <MinusIcon />
          </Button>
          <Button variant="outline" size="icon" aria-label="重做">
            <PlusIcon />
          </Button>
        </ButtonGroup>
      </div>
    ),
  },
  {
    name: "Badge",
    label: "状态与语义",
    demo: (
      <div className="flex flex-wrap items-center gap-2">
        <Badge>默认</Badge>
        <Badge variant="secondary">次要</Badge>
        <Badge variant="outline">描边</Badge>
        <Badge variant="destructive">危险</Badge>
        <Badge variant="ghost">幽灵</Badge>
        <Badge className="bg-chart-5/15 text-chart-5">成功</Badge>
        <Badge className="bg-chart-3/15 text-chart-3">警告</Badge>
        <Badge variant="outline">
          <CheckIcon data-icon="inline-start" />
          已验证
        </Badge>
      </div>
    ),
  },
  {
    name: "Input",
    label: "静止 / 已填 / 禁用 / 校验失败",
    demo: (
      <div className="grid w-full max-w-72 gap-2">
        <Input placeholder="请输入邮箱地址" />
        <Input defaultValue="starlr@xc-lr.cn" />
        <Input disabled defaultValue="不可编辑" />
        <Input aria-invalid defaultValue="格式不正确" />
      </div>
    ),
  },
  {
    name: "Textarea",
    label: "多行输入",
    demo: (
      <Textarea
        className="max-w-72"
        rows={3}
        placeholder="写点什么…"
        defaultValue="这个页面用 shadcn/ui 组件库搭建。"
      />
    ),
  },
  {
    name: "Label",
    label: "与控件关联",
    demo: (
      <div className="grid w-full max-w-72 gap-2">
        <Label htmlFor="demo-label-input">站点名称</Label>
        <Input id="demo-label-input" placeholder="星辰旅人" />
      </div>
    ),
  },
  {
    name: "Field",
    label: "标签 + 描述 + 错误",
    demo: (
      <FieldSet className="w-full max-w-72">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="demo-field-email">邮箱</FieldLabel>
            <Input id="demo-field-email" placeholder="you@example.com" />
            <FieldDescription>用于接收部署通知与账单提醒。</FieldDescription>
          </Field>
          <Field data-invalid="true">
            <FieldLabel htmlFor="demo-field-bad">密钥</FieldLabel>
            <Input id="demo-field-bad" aria-invalid defaultValue="abc" />
            <FieldError>密钥长度至少 16 位。</FieldError>
          </Field>
        </FieldGroup>
      </FieldSet>
    ),
  },
  {
    name: "InputGroup",
    label: "前缀 / 后缀 / 按钮",
    demo: (
      <div className="grid w-full max-w-72 gap-2">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="搜索文章…" />
        </InputGroup>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="xc-lr.cn" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="复制">
              <CopyIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupTextarea placeholder="多行 + 按钮" />
          <InputGroupAddon align="block-end">
            <InputGroupButton variant="default" size="xs">
              发送
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    ),
  },
  {
    name: "Select",
    label: "下拉选择",
    demo: (
      <Select defaultValue="react">
        <SelectTrigger className="w-56">
          <SelectValue placeholder="选择技术栈" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>前端</SelectLabel>
            <SelectItem value="react">React 19</SelectItem>
            <SelectItem value="vite">Vite 8</SelectItem>
            <SelectItem value="tailwind">Tailwind v4</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>部署</SelectLabel>
            <SelectItem value="edgeone">EdgeOne Pages</SelectItem>
            <SelectItem value="pages">GitHub Pages</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
  },
  {
    name: "Checkbox",
    label: "选中 / 未选 / 禁用",
    demo: (
      <div className="grid gap-3">
        <Label className="gap-2">
          <Checkbox defaultChecked />
          同步到远端仓库
        </Label>
        <Label className="gap-2">
          <Checkbox />
          构建时生成 sitemap
        </Label>
        <Label className="gap-2 opacity-60">
          <Checkbox disabled />
          历史版本归档（暂不可用）
        </Label>
      </div>
    ),
  },
  {
    name: "RadioGroup",
    label: "单选",
    demo: (
      <RadioGroup defaultValue="ssg" className="gap-3">
        <Label className="gap-2">
          <RadioGroupItem value="ssg" />
          静态预渲染（SSG）
        </Label>
        <Label className="gap-2">
          <RadioGroupItem value="ssr" />
          服务端渲染（SSR）
        </Label>
        <Label className="gap-2 opacity-60">
          <RadioGroupItem value="csr" disabled />
          纯客户端渲染（CSR）
        </Label>
      </RadioGroup>
    ),
  },
  {
    name: "Switch",
    label: "default / sm / 禁用",
    demo: (
      <div className="grid gap-3">
        <Label className="gap-2">
          <Switch defaultChecked />
          跟随系统主题
        </Label>
        <Label className="gap-2">
          <Switch size="sm" defaultChecked />
          紧凑尺寸
        </Label>
        <Label className="gap-2 opacity-60">
          <Switch disabled />
          禁用
        </Label>
      </div>
    ),
  },
  {
    name: "Slider",
    label: "单值 / 区间",
    demo: (
      <div className="grid w-full max-w-72 gap-4">
        <Slider defaultValue={[60]} max={100} step={1} />
        <Slider defaultValue={[25, 70]} max={100} step={1} />
      </div>
    ),
  },
  {
    name: "Progress",
    label: "进度",
    demo: (
      <div className="grid w-full max-w-72 gap-3">
        <Progress value={72} />
        <Progress value={32} />
        <Progress value={100} />
      </div>
    ),
  },
  {
    name: "Spinner",
    label: "加载态",
    demo: (
      <div className="flex items-center gap-4">
        <Spinner />
        <Spinner className="size-6" />
        <Button variant="outline" disabled>
          <Spinner />
          加载中
        </Button>
      </div>
    ),
  },
  {
    name: "Toggle",
    label: "开关型按钮",
    demo: (
      <div className="flex items-center gap-2">
        <Toggle aria-label="收藏">
          <StarIcon />
          收藏
        </Toggle>
        <Toggle variant="outline" defaultPressed aria-label="点赞">
          <HeartIcon />
          已赞
        </Toggle>
        <Toggle size="sm" variant="outline" aria-label="静音">
          <BellIcon />
        </Toggle>
      </div>
    ),
  },
  {
    name: "ToggleGroup",
    label: "单选 / 多选",
    demo: (
      <div className="flex flex-col items-start gap-3">
        <ToggleGroup type="single" variant="outline" defaultValue="medium">
          <ToggleGroupItem value="small">小</ToggleGroupItem>
          <ToggleGroupItem value="medium">中</ToggleGroupItem>
          <ToggleGroupItem value="large">大</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="multiple" variant="outline" defaultValue={["bold"]}>
          <ToggleGroupItem value="bold">粗体</ToggleGroupItem>
          <ToggleGroupItem value="italic">斜体</ToggleGroupItem>
          <ToggleGroupItem value="underline">下划线</ToggleGroupItem>
        </ToggleGroup>
      </div>
    ),
  },
  {
    name: "Tabs",
    label: "default 变体",
    demo: (
      <Tabs defaultValue="account" className="w-full max-w-80">
        <TabsList className="w-full">
          <TabsTrigger value="account">账户</TabsTrigger>
          <TabsTrigger value="security">安全</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="text-muted-foreground text-sm">
          账户面板内容：昵称、头像与站点信息。
        </TabsContent>
        <TabsContent value="security" className="text-muted-foreground text-sm">
          安全面板内容：登录设备与访问令牌。
        </TabsContent>
      </Tabs>
    ),
  },
  {
    name: "Tabs",
    label: "line 变体",
    demo: (
      <Tabs defaultValue="overview" className="w-full max-w-80">
        <TabsList variant="line">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="logs">日志</TabsTrigger>
          <TabsTrigger value="usage">用量</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="text-muted-foreground text-sm">
          概览内容
        </TabsContent>
        <TabsContent value="logs" className="text-muted-foreground text-sm">
          日志内容
        </TabsContent>
        <TabsContent value="usage" className="text-muted-foreground text-sm">
          用量内容
        </TabsContent>
      </Tabs>
    ),
  },
  {
    name: "Table",
    label: "表格",
    demo: (
      <Table>
        <TableCaption>最近的部署记录</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>服务</TableHead>
            <TableHead>状态</TableHead>
            <TableHead className="text-right">流量</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">xc-lr.cn</TableCell>
            <TableCell>
              <Badge className="bg-chart-5/15 text-chart-5">运行中</Badge>
            </TableCell>
            <TableCell className="text-right">82%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">blog-worker</TableCell>
            <TableCell>
              <Badge className="bg-chart-3/15 text-chart-3">排队</Badge>
            </TableCell>
            <TableCell className="text-right">45%</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>合计</TableCell>
            <TableCell className="text-right">127%</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    ),
  },
  {
    name: "Card",
    label: "卡片",
    demo: (
      <Card className="w-full max-w-72">
        <CardHeader>
          <CardTitle>本月访问</CardTitle>
          <CardDescription>统计数据来自自建 Umami。</CardDescription>
          <CardAction>
            <Badge variant="secondary">
              <TrendingUpIcon data-icon="inline-start" />
              +12%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          独立访客 4,218 人，页面浏览 11,902 次。
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="ghost" size="sm">
            忽略
          </Button>
          <Button size="sm">查看详情</Button>
        </CardFooter>
      </Card>
    ),
  },
  {
    name: "Alert",
    label: "四档语义",
    demo: (
      <div className="grid w-full gap-3">
        <Alert>
          <InfoIcon />
          <AlertTitle>计划维护</AlertTitle>
          <AlertDescription>今晚 03:00 进行常规巡检。</AlertDescription>
        </Alert>
        <Alert className="text-chart-5 *:data-[slot=alert-description]:text-chart-5/90">
          <CheckIcon />
          <AlertTitle>部署成功</AlertTitle>
          <AlertDescription>静态资源已同步到 CDN。</AlertDescription>
        </Alert>
        <Alert className="text-chart-3 *:data-[slot=alert-description]:text-chart-3/90">
          <TriangleAlertIcon />
          <AlertTitle>流量偏高</AlertTitle>
          <AlertDescription>本月已用配额 88%。</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <XCircleIcon />
          <AlertTitle>请求失败</AlertTitle>
          <AlertDescription>接口返回 401，请重新登录。</AlertDescription>
          <AlertAction>
            <Button size="xs" variant="outline">
              重试
            </Button>
          </AlertAction>
        </Alert>
      </div>
    ),
  },
  {
    name: "Avatar",
    label: "图片 / 回退 / 角标",
    demo: (
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src="/favicon.png" alt="星辰旅人" />
          <AvatarFallback>SL</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>二叉</AvatarFallback>
          <AvatarBadge className="bg-chart-5" />
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  {
    name: "AvatarGroup",
    label: "头像组",
    demo: (
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>AF</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>SX</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>QW</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+5</AvatarGroupCount>
      </AvatarGroup>
    ),
  },
  {
    name: "Skeleton",
    label: "骨架屏",
    demo: (
      <div className="flex w-full max-w-72 items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ),
  },
  {
    name: "Separator",
    label: "横向与纵向",
    demo: (
      <div className="grid w-full max-w-72 gap-3">
        <div className="text-muted-foreground text-sm">上方内容</div>
        <Separator />
        <div className="text-muted-foreground text-sm">下方内容</div>
        <div className="flex h-5 items-center gap-3 text-sm">
          <span>左</span>
          <Separator orientation="vertical" />
          <span>中</span>
          <Separator orientation="vertical" />
          <span>右</span>
        </div>
      </div>
    ),
  },
  {
    name: "Breadcrumb",
    label: "面包屑",
    demo: (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">首页</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/posts">文章</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>组件预览</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
  },
  {
    name: "Pagination",
    label: "分页",
    demo: (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
  },
  {
    name: "Item",
    label: "列表项",
    demo: (
      <ItemGroup className="w-full max-w-80">
        <Item variant="outline">
          <ItemMedia variant="icon">
            <FileTextIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>EdgeOne Worker 部署记录</ItemTitle>
            <ItemDescription>更新于 3 天前 · 6 分钟阅读</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="icon-sm" aria-label="更多">
              <MoreHorizontalIcon />
            </Button>
          </ItemActions>
        </Item>
        <ItemSeparator />
        <Item variant="muted">
          <ItemMedia variant="icon">
            <DatabaseIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>博客数据备份</ItemTitle>
            <ItemDescription>每周日凌晨自动执行</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="secondary">已启用</Badge>
          </ItemActions>
        </Item>
      </ItemGroup>
    ),
  },
  {
    name: "Empty",
    label: "空状态",
    demo: (
      <Empty className="w-full max-w-80 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>暂无草稿</EmptyTitle>
          <EmptyDescription>新建的文章会先保存在这里。</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm">
            <PlusIcon data-icon="inline-start" />
            新建文章
          </Button>
        </EmptyContent>
      </Empty>
    ),
  },
  {
    name: "Accordion",
    label: "折叠面板",
    demo: (
      <Accordion type="single" collapsible className="w-full max-w-80">
        <AccordionItem value="a">
          <AccordionTrigger>如何自定义主题色？</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            修改 src/index.css 中的 --primary 等 CSS 变量即可，亮暗两套分别定义。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>组件放在哪里？</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            全部收敛在 src/components/ui 目录，页面只负责组合。
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  {
    name: "Collapsible",
    label: "可折叠区域",
    demo: (
      <Collapsible className="w-full max-w-80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">高级选项</span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="展开">
              <ChevronDownIcon />
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-lg border px-3 py-2 text-sm text-muted-foreground">
          构建缓存已命中
        </div>
        <CollapsibleContent className="rounded-lg border px-3 py-2 text-sm text-muted-foreground">
          额外选项：并行构建、图片压缩、链接检查。
        </CollapsibleContent>
      </Collapsible>
    ),
  },
  {
    name: "Dialog",
    label: "对话框",
    demo: (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">打开对话框</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认发布？</DialogTitle>
            <DialogDescription>
              发布后将触发一次完整构建，并同步到生产环境。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button>确认发布</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    name: "AlertDialog",
    label: "确认弹窗",
    demo: (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">删除草稿</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定删除这篇草稿？</AlertDialogTitle>
            <AlertDialogDescription>
              删除后无法恢复，相关的封面图也会一并清理。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
  },
  {
    name: "Sheet",
    label: "侧边抽屉",
    demo: (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">打开抽屉</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>站点设置</SheetTitle>
            <SheetDescription>调整外观与内容偏好。</SheetDescription>
          </SheetHeader>
          <div className="grid gap-3 px-4 text-sm text-muted-foreground">
            <div>默认主题：跟随系统</div>
            <div>每页文章数：8</div>
            <div>评论：Giscus</div>
          </div>
          <SheetFooter>
            <Button>保存</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ),
  },
  {
    name: "Drawer",
    label: "底部抽屉",
    demo: (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">打开底部抽屉</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>分享这篇文章</DrawerTitle>
            <DrawerDescription>选择分享渠道。</DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-2 px-4 text-sm">
            <Button variant="ghost" className="justify-start">
              <ShareIcon data-icon="inline-start" />
              复制链接
            </Button>
            <Button variant="ghost" className="justify-start">
              <BookmarkIcon data-icon="inline-start" />
              加入收藏
            </Button>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">关闭</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    ),
  },
  {
    name: "DropdownMenu",
    label: "下拉菜单",
    demo: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">打开菜单</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>我的账户</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserIcon />
            个人资料
            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon />
            站点设置
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>
            显示草稿
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <LogOutIcon />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    name: "ContextMenu",
    label: "右键菜单",
    demo: (
      <ContextMenu>
        <ContextMenuTrigger className="flex h-24 w-full max-w-72 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
          在区域内右键点击
        </ContextMenuTrigger>
        <ContextMenuContent className="w-44">
          <ContextMenuItem>
            <CopyIcon />
            复制
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <DownloadIcon />
            下载
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">
            <TrashIcon />
            删除
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    ),
  },
  {
    name: "Menubar",
    label: "菜单栏",
    demo: (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>文件</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              新建文章
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>打开…</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>导出</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>视图</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>放大</MenubarItem>
            <MenubarItem>缩小</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
  },
  {
    name: "NavigationMenu",
    label: "导航菜单",
    demo: (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>内容</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-48 gap-1 p-2">
                <li>
                  <NavigationMenuLink href="/posts">文章列表</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="/archive">归档</NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about">关于</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ),
  },
  {
    name: "Popover",
    label: "气泡卡片",
    demo: (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CalendarIcon data-icon="inline-start" />
            查看域名
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="grid gap-2 text-sm">
            <div className="font-medium">xc-lr.cn</div>
            <div className="text-muted-foreground">
              主站域名，解析到 EdgeOne Pages。
            </div>
            <Separator />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>HTTPS</span>
              <Badge className="bg-chart-5/15 text-chart-5">已启用</Badge>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    ),
  },
  {
    name: "HoverCard",
    label: "悬停卡片",
    demo: (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">@wwwaaa123122</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-72">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src="/favicon.png" alt="星辰旅人" />
              <AvatarFallback>SL</AvatarFallback>
            </Avatar>
            <div className="grid gap-1 text-sm">
              <div className="font-medium">星辰旅人</div>
              <div className="text-muted-foreground">
                喜欢折腾网络技术与静态站部署。
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    ),
  },
  {
    name: "Tooltip",
    label: "悬停提示",
    demo: (
      <TooltipProvider>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" aria-label="首页">
                <HomeIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>返回首页</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" aria-label="源码">
                <CodeIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>查看组件源码</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    ),
  },
  {
    name: "Command",
    label: "命令面板",
    demo: (
      <Command className="w-full max-w-80 border">
        <CommandInput placeholder="输入命令或搜索…" />
        <CommandList>
          <CommandEmpty>没有匹配结果。</CommandEmpty>
          <CommandGroup heading="建议">
            <CommandItem>
              <HomeIcon />
              回到首页
              <CommandShortcut>⌘H</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <SearchIcon />
              搜索文章
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="设置">
            <CommandItem>
              <SettingsIcon />
              打开设置
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ),
  },
  {
    name: "Calendar",
    label: "日期选择",
    demo: (
      <Calendar
        mode="single"
        selected={new Date(2025, 8, 23)}
        defaultMonth={new Date(2025, 8, 1)}
        className="rounded-xl border"
      />
    ),
  },
  {
    name: "InputOTP",
    label: "验证码输入",
    demo: (
      <InputOTP maxLength={6} defaultValue="204815">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    ),
  },
  {
    name: "ScrollArea",
    label: "自定义滚动条",
    demo: (
      <ScrollArea className="h-40 w-full max-w-72 rounded-lg border p-3">
        <div className="grid gap-3 text-sm">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="text-muted-foreground">
              第 {i + 1} 条部署日志 · 构建成功
            </div>
          ))}
        </div>
      </ScrollArea>
    ),
  },
  {
    name: "AspectRatio",
    label: "固定宽高比",
    demo: (
      <AspectRatio ratio={16 / 9} className="w-full max-w-72 overflow-hidden rounded-xl border">
        <div className="flex size-full items-center justify-center bg-muted text-sm text-muted-foreground">
          16 : 9
        </div>
      </AspectRatio>
    ),
  },
  {
    name: "Toast",
    label: "Sonner 四档语义",
    demo: (
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast("已复制链接到剪贴板")}
        >
          信息
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success("部署成功")}
        >
          成功
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.warning("配额即将用尽")}
        >
          警告
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.error("请求失败：401")}
        >
          错误
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toast.promise(new Promise((r) => setTimeout(r, 1500)), {
              loading: "正在构建…",
              success: "构建完成",
              error: "构建失败",
            })
          }}
        >
          Promise
        </Button>
      </div>
    ),
  },
  {
    name: "Sidebar",
    label: "侧边栏壳（含切换按钮）",
    demo: (
      <SidebarProvider className="min-h-64 w-full max-w-80">
        <Sidebar collapsible="icon" className="absolute">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" isActive>
                  <RocketIcon />
                  <span>星辰旅人</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>工作区</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <LayoutDashboardIcon />
                      <span>概览</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FileTextIcon />
                      <span>文章</span>
                      <SidebarMenuBadge>12</SidebarMenuBadge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <SettingsIcon />
                      <span>设置</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarSeparator />
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <LogOutIcon />
                  <span>退出</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <SidebarTrigger />
          主内容区域
        </SidebarInset>
      </SidebarProvider>
    ),
  },
  {
    name: "Icon",
    label: "Lucide 图标 + 工具类",
    demo: (
      <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
        <RocketIcon className="size-5" />
        <CloudIcon className="size-5" />
        <LifeBuoyIcon className="size-5" />
        <CreditCardIcon className="size-5" />
        <AlertCircleIcon className="size-5" />
        <MailIcon className="size-5" />
        <Badge variant="outline">
          <StarIcon data-icon="inline-start" />
          星标
        </Badge>
      </div>
    ),
  },
]

export { ButtonGroup }
export const demoTotal = demoCells.length
