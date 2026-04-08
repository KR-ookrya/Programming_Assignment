// 연락처 폼 제출 처리
function handleSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const result = document.getElementById('form-result');

  result.textContent = `${name}님, 메시지가 전송되었습니다! 감사합니다.`;

  event.target.reset();

  setTimeout(() => {
    result.textContent = '';
  }, 4000);
}

// 스크롤 시 네비게이션 활성화
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = '#4f46e5';
    }
  });
});

// 카드 페이드인 애니메이션
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(card);
});
