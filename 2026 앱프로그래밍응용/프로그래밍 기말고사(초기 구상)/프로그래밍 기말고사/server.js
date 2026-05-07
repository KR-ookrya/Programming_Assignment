require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const client = new Anthropic();

app.use(express.json({ limit: '50kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const SYSTEM_PROMPT = `당신은 10년 이상 경력의 전문 자기소개서 첨삭 컨설턴트입니다. 취업 준비생의 자기소개서를 심층 분석하고 실질적인 개선 방향을 제공합니다.

아래 형식에 맞춰 한국어로 상세한 피드백을 제공하세요:

## 📊 종합 평가
현재 자기소개서의 전반적인 수준과 인상을 3~4문장으로 솔직하게 평가하세요.

## 🎯 점수
전체 완성도: **X점 / 100점**
- 내용의 구체성: X점 / 25점
- 문장 표현력: X점 / 25점
- 직무 적합성: X점 / 25점
- 차별화 포인트: X점 / 25점

## ✅ 잘된 점
구체적으로 어떤 부분이 좋은지 불릿으로 나열하세요.

## ⚠️ 개선이 필요한 부분
각 문제점에 대해 **왜 문제인지**와 **어떻게 고쳐야 하는지** 구체적으로 설명하세요. 단순 나열이 아닌 실질적인 조언을 제공하세요.

## ✍️ 첨삭된 자기소개서
원문의 구조를 유지하면서 더 임팩트 있고 설득력 있는 표현으로 완성된 자기소개서를 작성하세요. 수치, 구체적 사례, 성과 중심의 표현을 활용하세요.

---
중요: 실질적이고 구체적인 피드백을 제공하세요. 칭찬만 늘어놓지 말고 명확한 개선점을 지적하세요.`;

app.post('/api/analyze', async (req, res) => {
  const { text, jobTitle, company } = req.body;

  if (!text || text.trim().length < 50) {
    return res.status(400).json({ error: '자기소개서 내용이 너무 짧습니다. 최소 50자 이상 입력해주세요.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  let userMessage = '다음 자기소개서를 첨삭해주세요.\n\n';
  if (jobTitle) userMessage += `지원 직무: ${jobTitle}\n`;
  if (company) userMessage += `지원 회사: ${company}\n`;
  userMessage += `\n[자기소개서 원문]\n${text}`;

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    const msg = err.status === 401
      ? 'API 키가 유효하지 않습니다. ANTHROPIC_API_KEY를 확인해주세요.'
      : `오류가 발생했습니다: ${err.message}`;
    res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✅ AI 자기소개서 첨삭 앱 실행 중`);
  console.log(`👉 http://localhost:${PORT}\n`);
});
