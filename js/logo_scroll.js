/* Logo 滚动墙动画驱动（JS requestAnimationFrame，绕过 CSS 动画兼容问题） */
(function () {
  var DURATION = 60000; /* 60s 一轮 */

  function initScroll() {
    var wrapper = document.querySelector('#skills-tags-group-all .tags-group-wrapper');
    if (!wrapper) return;

    /* 避免重复初始化 */
    if (wrapper.getAttribute('data-scroll-js')) return;
    wrapper.setAttribute('data-scroll-js', '');

    /* 确保 wrapper 内容有双份副本（无缝循环需要） */
    var children = Array.from(wrapper.children);
    if (children.length > 0 && children.length % 2 !== 0) {
      children.forEach(function (c) {
        wrapper.appendChild(c.cloneNode(true));
      });
    }

    /* 计算总宽度的一半（即一份内容的宽度） */
    function getHalfWidth() {
      return wrapper.scrollWidth / 2;
    }

    var start = null;

    function step(timestamp) {
      /* 如果元素已从 DOM 移除（PJAX 切页），停止动画 */
      if (!document.body.contains(wrapper)) return;
      if (!start) start = timestamp;
      var elapsed = timestamp - start;
      var progress = (elapsed % DURATION) / DURATION; /* 0 → 1 */
      var half = getHalfWidth();
      wrapper.style.transform = 'translateX(' + (-half * progress) + 'px)';
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* 首次加载时初始化 */
  initScroll();

  /* PJAX 切换完成后重新初始化（anzhiyu 主题事件） */
  document.addEventListener('pjax:complete', initScroll);

  /* 也监听 pjax:send 来重置状态 */
  document.addEventListener('pjax:send', function () {
    var w = document.querySelector('#skills-tags-group-all .tags-group-wrapper');
    if (w) { w.removeAttribute('data-scroll-js'); }
  });
})();
