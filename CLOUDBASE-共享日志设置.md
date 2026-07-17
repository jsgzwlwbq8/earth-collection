# 共享日志的 CloudBase 设置

共享日志使用腾讯云 CloudBase 的匿名登录和文档数据库，不需要 npm。

## 第一步：创建环境

1. 打开腾讯云 CloudBase 控制台。
2. 创建一个云开发环境。
3. 复制“环境 ID”，不要复制 SecretId 或 SecretKey。
4. 在“身份认证 / 登录方式”中开启“匿名登录”。

## 第二步：创建四个数据集合

在“文档型数据库”中创建：

- `shared_rooms`
- `shared_members`
- `shared_posts`
- `shared_comments`

## 第三步：设置安全规则

每个集合进入“权限管理”，切换到“安全规则”，分别粘贴下面的内容。

### shared_rooms

```json
{
  "read": "get(`database.shared_members.${doc._id}_${auth.uid}`).userId == auth.uid",
  "create": "doc.ownerId == auth.uid",
  "update": "doc.ownerId == auth.uid",
  "delete": "doc.ownerId == auth.uid"
}
```

### shared_members

```json
{
  "read": "get(`database.shared_members.${doc.roomCode}_${auth.uid}`).userId == auth.uid",
  "create": "doc.userId == auth.uid",
  "update": "doc.userId == auth.uid",
  "delete": "doc.userId == auth.uid"
}
```

### shared_posts

```json
{
  "read": "get(`database.shared_members.${doc.roomCode}_${auth.uid}`).userId == auth.uid",
  "create": "get(`database.shared_members.${doc.roomCode}_${auth.uid}`).userId == auth.uid && doc.userId == auth.uid",
  "update": "doc.userId == auth.uid",
  "delete": "doc.userId == auth.uid"
}
```

### shared_comments

```json
{
  "read": "get(`database.shared_members.${doc.roomCode}_${auth.uid}`).userId == auth.uid",
  "create": "get(`database.shared_members.${doc.roomCode}_${auth.uid}`).userId == auth.uid && doc.userId == auth.uid",
  "update": "doc.userId == auth.uid",
  "delete": "doc.userId == auth.uid"
}
```

安全规则修改后可能需要等待几分钟才生效。

## 第四步：设置安全域名

正式发布后，把网站域名加入 CloudBase 的 Web 安全域名。没有加入的网页可能会被识别为非法来源。

## 第五步：连接

1. 打开“地球收藏夹”。
2. 点击顶部的“👥共享日志”。
3. 填写环境 ID。
4. 点击“连接共享日志”。
5. 填写昵称，然后创建共享空间或输入朋友的邀请码。

邀请码相当于共享空间的钥匙，只发给信任的人。
