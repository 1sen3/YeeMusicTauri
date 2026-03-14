请帮我重构这个 React Section 组件。当前代码使用了复杂的容器宽度监听 (useContainerWidth) 和手动分页切分（chunking）逻辑来实现轮播，代码过于臃肿。

我希望你将它重构为基于原生 Flexbox 和原生滚动 API 的实现。具体要求如下：

1. 彻底移除计算逻辑：删除 useContainerWidth、itemPerView、totalPages 计算，以及将 children 切分成二维数组的逻辑，也移除 currentPage 状态。
2. 直接使用一维 Flex 布局：在内容层，直接用一个 flex 容器包裹所有的 children（不再嵌套多层 div）。使用 overflow-x-auto 允许横向滚动，并使用 CSS 隐藏原生滚动条（如 scrollbar-width: none 或 Tailwind 的相关类）。配合 gap-8 保持间距。
3. 保留并优化平滑滚动动画：
  - 使用 useRef 获取该滚动容器的 DOM。
  - 保留左右控制按钮（handlePrev 和 handleNext）。
  - 在按钮的点击事件中，使用原生的 containerRef.current.scrollBy({ left: 滚动距离, behavior: 'smooth' }) 来实现平滑滚动效果。
  - 每次滚动的距离可以设定为容器当前可视宽度的一部分（例如 clientWidth * 0.8），或者基于固定的 item 宽度，以保证良好的翻页体验。
  - 保持 UI 现状：现有的标题栏样式、YeeButton 样式、seeMore 和 refresh 的条件渲染逻辑请保持完全不变。
  - 可选优化（Scroll Snap）：如果合适，可以给容器加上 CSS Scroll Snap 特性（snap-x snap-mandatory），让滚动停顿更加干脆利落。
