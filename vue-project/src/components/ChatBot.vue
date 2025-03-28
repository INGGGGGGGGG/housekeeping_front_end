<template>
  <!-- 创建一个容器用于挂载聊天机器人 -->
  <div id="chatbot-container"></div>
</template>

<script>
export default {
  name: 'ChatBot',
  mounted() {
    // 动态添加样式和脚本
    this.addExternalResources();
    // 初始化配置
    this.initChatbotConfig();
  },
  methods: {
    addExternalResources() {
      // 添加 CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://g.alicdn.com/aliyun-documentation/web-chatbot-ui/0.0.24/index.css';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);

      // 添加 JS
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://g.alicdn.com/aliyun-documentation/web-chatbot-ui/0.0.24/index.js';
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    },
    initChatbotConfig() {
      // 初始化配置
      window.CHATBOT_CONFIG = {
        endpoint: "http://localhost:8080/chatbot/chat",
        displayByDefault: false,
        title: 'AI 助手',
        draggable: true,
        aiChatOptions: {
          conversationOptions: {
            conversationStarters: [
              { prompt: '在福建三明，需要请一个保洁，有推荐的吗？' },
              { prompt: '在福建三明，家中有老人需要护理，有推荐的吗？' },
              { prompt: '在福建三明，家中有宠物需要照顾，有推荐的吗?' },
            ]
          },
          // 其他配置保持原样...
        }
      };
    }
  }
}
</script>

<style scoped>
/* 组件级样式 */
:root {
  --webchat-toolbar-background-color: #1464E4;
  --webchat-toolbar-text-color: #FFF;
}

/* 调整定位 */
#chatbot-container::v-deep .webchat-container {
  z-index: 100;
  bottom: 10px;
  right: 10px;
}

#chatbot-container::v-deep .webchat-bubble-tip {
  z-index: 99;
  bottom: 20px;
  right: 20px;
}
</style>