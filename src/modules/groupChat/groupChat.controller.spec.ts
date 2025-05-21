import { Test, TestingModule } from '@nestjs/testing';
import { GroupChatController } from './groupChat.controller';
import { GroupChatService } from './groupChat.service';

describe('GroupChatsController', () => {
  let controller: GroupChatController;

  const mockGroupChatService = {
    createGroupChat: jest.fn(),
    sendMessage: jest.fn(),
    getMyList: jest.fn(),
    getMessages: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupChatController],
      providers: [
        {
          provide: GroupChatService,
          useValue: mockGroupChatService,
        },
      ],
    }).compile();

    controller = module.get<GroupChatController>(GroupChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Thêm các test khác nếu cần
});
