# Chat Service

## Demo & Links
- **Demo:** [http://ec2-13-239-36-171.ap-southeast-2.compute.amazonaws.com/](http://ec2-13-239-36-171.ap-southeast-2.compute.amazonaws.com/)
- **REST API Documentation:** [http://ec2-13-239-36-171.ap-southeast-2.compute.amazonaws.com:3000/api](http://ec2-13-239-36-171.ap-southeast-2.compute.amazonaws.com:3000/api)
- **Frontend Source:** [https://github.com/quangvuong97/web-chat](https://github.com/quangvuong97/web-chat)

## CI/CD
Dự án được cấu hình CI/CD để tự động đẩy lên EC2 của AWS, đảm bảo quá trình triển khai nhanh chóng và hiệu quả.

## Mô tả
Dự án Chat Service là một ứng dụng chat realtime được xây dựng trên nền tảng NestJS, sử dụng WebSocket để xử lý các kết nối realtime và REST API cho các tác vụ thông thường.

## Kiến trúc hệ thống

### Sơ đồ kiến trúc

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                Client Layer                                 │
│          ┌─────────────┐                           ┌─────────────┐          │
│          │ Web Client  │                           │Mobile Client│          │
│          └──────┬──────┘                           └──────┬──────┘          │
└─────────────────┼─────────────────────────────────────────┼─────────────────┘
                  │                                         │
┌─────────────────────────────────────────────────────────────────────────────┐
│                             Application Layer                               │
│      ┌───────────────────────────┐        ┌───────────────────────────┐     │
│      │     REST API Requests     │        │   WebSocket Connections   │     │
│      └─────────────┬─────────────┘        └─────────────┬─────────────┘     │
└────────────────────┼────────────────────────────────────┼───────────────────┘
                     │                                    │               
┌────────────────────│────────────────────────────────────│───────────────────┐
┌  ┌─────────────────┼────────────────┐    ┌──────────────┼────────────┐      │
│  │      REST API Modules            │    │     WebSocket Module      │      │
│  │ ┌─────────┬─────────┬─────────┐  │    │     ┌───────────────┐     │      │
│  │ │  Auth   │  Users  │  Group  │  │    │     │   Chat        │     │      │
│  │ │ Module  │ Module  │  Chat   │  │    │     │   Module      │     │      │
│  │ └─────────┴─────────┴─────────┘  │    │     └───────────────┘     │      │
│  └─────────────────┬────────────────┘    └──────────────┬────────────┘      │
└────────────────────│────────────────────────────────────│───────────────────┘
                     │                                    │              
┌───────────────────────────────────────┬──────────────────────────────────────┐
│           MongoDB                     │       Socket.IO Adapter (Redis)      │
└───────────────────────────────────────┴──────────────────────────────────────┘
```

### Các thành phần chính

1. **Client Layer**
   - Web Client: Giao diện web cho người dùng
   - Mobile Client: Ứng dụng di động cho người dùng
   - Hỗ trợ cả REST API và WebSocket connections

2. **Application Layer**
   - REST API Modules:
     - Auth Module: Xử lý đăng nhập, đăng ký
     - Users Module: Quản lý thông tin người dùng
     - GroupChat Module: Quản lý nhóm chat, thành viên
   - WebSocket Module:
     - Chat Module: Xử lý kết nối realtime và phân phối tin nhắn

3. **Infrastructure Layer**
   - MongoDB: Lưu trữ dữ liệu chính
   - Socket.IO Adapter: Quản lý các kết nối WebSocket

### Luồng xử lý chính




## Cài đặt và Chạy dự án

### Yêu cầu hệ thống
- Node.js >= 16
- Yarn package manager
- MongoDB
- Redis cho socketIoAdapter

### Cài đặt môi trường local
1. Clone repository:
```bash
git clone <repository-url>
cd chat-service
```

2. Cài đặt dependencies:
```bash
yarn install
```

3. Tạo file môi trường:
```bash
cp .env
```

4. Cấu hình các biến môi trường trong file .env:
```env
# Server
API_PORT=<your api port>
# Database
MONGODB_URI=<your mongodb uri>

# Redis
REDIS_HOST=<your redis host>
REDIS_PORT=<your redis port>
REDIS_USERNAME=<your redis username>
REDIS_PASSWORD=<your redis password>

# JWT
JWT_SECRET=<your-secret-key>
```

5. Chạy ứng dụng:
```bash
# Development mode
yarn start:dev
```
## WebSocket API Documentation

### Kết nối WebSocket
```javascript
const socket = io("http://localhost:3000/chat", {
  auth: { token },
  transports: ["websocket"],
});
```

### Các sự kiện WebSocket

#### 1. Kết nối và Xác thực
- **Event**: `connection`
- **Payload**: JWT token trong header
- **Response**: 
  - Kết nối thành công: Client được thêm vào phòng riêng của user
  - Lỗi xác thực: Client bị ngắt kết nối và nhận thông báo lỗi

#### 2. Tham gia nhóm chat
- **Event**: `join_group`
- **Payload**:
```typescript
{
  groupId: string;
}
```
- **Mô tả**: Client tham gia vào một cuộc trò chuyện
- **Response**:
  - Thành công: Client được thêm vào phòng chat của nhóm
  - Lỗi: 
    - Nhóm không tồn tại
    - User không phải thành viên của nhóm
    - Lỗi xác thực dữ liệu

#### 3. Rời nhóm chat
- **Event**: `leave_group`
- **Payload**:
```typescript
{
  groupId: string;
}
```
- **Mô tả**: Client không trong cuộc trò chuyện nữa (ko phải là rời nhóm)

#### 4. Nhận tin nhắn mới
- **Event**: `new_message`
- **Payload**: Thông tin tin nhắn mới (GetListMessageResponse)
- **Mô tả**: khi một tin nhắn được gửi thành công, server gửi tin nhắn mới đến những ai đang trong cuộc trò chuyện đó

#### 5. Thông báo có tin nhắn mới
- **Event**: `group_new_message`
- **Payload**: Thông tin nhóm chat (GroupChat)
- **Mô tả**: khi một tin nhắn được gửi thành công, server gửi thông báo đến tất cả thành viên trong nhóm (trừ thiết bị gửi)

```
- **Mô tả**: Sự kiện này được gửi khi có lỗi xảy ra trong quá trình xử lý các sự kiện khác

## Testing

```bash
# Unit tests
yarn test

# Test coverage
yarn test:cov
```

## Docker

Build và chạy ứng dụng với Docker:

```bash
# Build image
docker build -t chat-service .

# Run container
docker run -p 3000:3000 -p 8080:5000 my-chat-demo
```

## License

[MIT licensed](LICENSE)
