<script setup lang="ts">
  import { ref } from 'vue'
  import { Button } from '@shared/ui'

  const githubUrl = 'https://github.com/zhaoxuan-inside'
  const visitorCount = ref(1286)

  const incrementCount = () => {
    visitorCount.value++
  }

  const openGithub = () => {
    window.open(githubUrl, '_blank')
  }
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-8"
  >
    <div class="max-w-2xl w-full text-center">
      <div class="mb-8">
        <div
          class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl mb-6"
        >
          <svg class="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.604-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.578 9.578 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.295 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-slate-800 mb-4">zhaoxuan-inside</h1>
        <p class="text-lg text-slate-600 mb-6">欢迎访问我的 GitHub 主页</p>
        <a
          :href="githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <span class="underline">{{ githubUrl }}</span>
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div class="flex items-center justify-center space-x-4 mb-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-slate-800">{{ visitorCount }}</div>
            <div class="text-sm text-slate-500 mt-1">访客数</div>
          </div>
          <div class="w-px h-12 bg-slate-200"></div>
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">Vue 3</div>
            <div class="text-sm text-slate-500 mt-1">技术栈</div>
          </div>
          <div class="w-px h-12 bg-slate-200"></div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">FSD</div>
            <div class="text-sm text-slate-500 mt-1">架构</div>
          </div>
        </div>
        <Button class="w-full py-3" @click="incrementCount">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          点击访问
        </Button>
      </div>

      <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <h3 class="text-xl font-semibold mb-2">关于这个模板</h3>
        <p class="text-blue-100">
          Vue 3 + TypeScript + FSD 团队开发模板，集成 Naive UI、Tailwind CSS v4、Pinia
          等现代化技术栈
        </p>
        <Button
          variant="secondary"
          class="mt-4 bg-white text-blue-600 hover:bg-blue-50"
          @click="openGithub"
        >
          查看源码
        </Button>
      </div>
    </div>
  </div>
</template>
