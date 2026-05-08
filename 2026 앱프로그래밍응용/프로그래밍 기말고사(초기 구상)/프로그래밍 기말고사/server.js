const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(express.json({ limit: '2mb' }));
app.use(express.static('2026 앱프로그래밍응용'));

const SYSTEM_PROMPT = `당신은 10년 경력의 채용 전문가이자 자기소개서 첨삭 전문가입니다. 지원자의 자기소개서를 심층 분석하여 구체적이고 실질적인 피드백을 제공합니다. 마크다운 형식으로 답변하며, 수치와 구체적 사례를 중심으로 개선 방향을 제시합니다.`;

function startStream(res) {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
}

async function pipeStream(apiStream, res) {
  for await (const chunk of apiStream) {
    if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
      res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
    }
  }
  res.write('data: [DONE]\n\n');
  res.end();
}

app.post('/api/analyze', async (req, res) => {
  const { text, jobTitle, company, sectionType } = req.body;
  if (!text || text.trim().length < 50) {
    return res.status(400).json({ error: '자기소개서를 최소 50자 이상 입력해주세요.' });
  }

  const contextParts = [];
  if (jobTitle) contextParts.push(`지원 직무: ${jobTitle}`);
  if (company) contextParts.push(`지원 회사: ${company}`);
  if (sectionType && sectionType !== '전체') contextParts.push(`집중 분석 항목: ${sectionType}`);
  const contextStr = contextParts.length ? `\n\n[지원 정보]\n${contextParts.join('\n')}` : '';
  const focusStr = sectionType && sectionType !== '전체'
    ? `\n\n⚠️ 특히 "${sectionType}" 항목에 집중하여 분석하고, 해당 항목의 첨삭에 비중을 두세요.`
    : '';

  const prompt = `다음 자기소개서를 전문적으로 첨삭해주세요.${contextStr}${focusStr}

[자기소개서]
${text}

아래 형식으로 답변해주세요:

## 1. 종합 평가
전반적인 수준과 첫인상을 2-3문장으로 작성하세요.

## 2. 점수 (100점 만점)
| 항목 | 점수 | 코멘트 |
|------|------|--------|
| 내용의 구체성 | /25 | |
| 문장 표현력 | /25 | |
| 직무 적합성 | /25 | |
| 차별화 포인트 | /25 | |
| **총점** | **/100** | |

## 3. 잘된 점
구체적인 강점을 3가지 이상 제시하세요.

## 4. 개선이 필요한 부분
문제점과 구체적인 해결 방법을 3가지 이상 제시하세요.

## 5. 첨삭된 자기소개서
수치·성과 중심으로 개선된 완성본을 작성하세요.`;

  startStream(res);
  try {
    const stream = await client.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });
    await pipeStream(stream, res);
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

app.post('/api/followup', async (req, res) => {
  const { originalText, jobTitle, company, sectionType, analysisResult, question } = req.body;
  if (!question || question.trim().length < 5) {
    return res.status(400).json({ error: '질문을 5자 이상 입력해주세요.' });
  }

  const contextParts = [
    jobTitle && `직무: ${jobTitle}`,
    company && `회사: ${company}`,
    sectionType && sectionType !== '전체' && `항목: ${sectionType}`,
  ].filter(Boolean);
  const contextStr = contextParts.length ? ` (${contextParts.join(', ')})` : '';

  startStream(res);
  try {
    const stream = await client.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `[원본 자기소개서${contextStr}]\n${originalText}\n\n[첨삭 결과]\n${analysisResult}\n\n[추가 질문]\n${question}`,
        },
      ],
    });
    await pipeStream(stream, res);
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

app.post('/api/translate', async (req, res) => {
  const { analysisResult, jobTitle, company } = req.body;
  if (!analysisResult || analysisResult.trim().length < 10) {
    return res.status(400).json({ error: '번역할 내용이 없습니다.' });
  }

  const contextParts = [
    jobTitle && `Position: ${jobTitle}`,
    company && `Company: ${company}`,
  ].filter(Boolean);
  const contextStr = contextParts.length ? ` (${contextParts.join(', ')})` : '';

  startStream(res);
  try {
    const stream = await client.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 2048,
      system: 'You are a professional Korean-to-English translator specializing in business documents and cover letters.',
      messages: [
        {
          role: 'user',
          content: `The following is an AI-edited Korean cover letter analysis${contextStr}.
Please find the "첨삭된 자기소개서" (edited cover letter) section and translate it into polished, professional English.
Output ONLY the English cover letter text with no additional explanation or commentary.

[Analysis Result]
${analysisResult}`,
        },
      ],
    });
    await pipeStream(stream, res);
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
