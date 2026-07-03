# Qwen Fraud Review Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real Qwen-backed fraud-review agent to UniProof without exposing the API key in the browser.

**Architecture:** The React app calls a same-origin `/api/fraud-agent` endpoint with bounded claim context. The Vercel serverless function calls Qwen through DashScope's OpenAI-compatible chat completions endpoint when `QWEN_API_KEY` or `DASHSCOPE_API_KEY` is present. A deterministic local fallback keeps local Vite demos functional.

**Tech Stack:** React, TypeScript, Vite, Vitest, Vercel serverless function, Qwen/DashScope OpenAI-compatible Chat Completions.

---

### Task 1: Shared Fraud Agent Model

**Files:**
- Modify: `src/types.ts`
- Create: `src/lib/fraudAgent.ts`
- Test: `src/__tests__/fraudAgent.test.ts`

- [ ] Add `FraudReview`, `FraudReviewContext`, and related union types to `src/types.ts`.
- [ ] Implement `createFraudReviewContext`, `createLocalFraudReview`, and `requestFraudReview` in `src/lib/fraudAgent.ts`.
- [ ] Test low-risk approval, high-risk unverified student, duplicate nullifier, and network fallback.

### Task 2: Qwen Serverless Route

**Files:**
- Create: `api/fraud-agent.js`

- [ ] Add a POST-only API route.
- [ ] Read `QWEN_API_KEY` or `DASHSCOPE_API_KEY` from environment variables.
- [ ] Call `${QWEN_BASE_URL || DASHSCOPE_BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"}/chat/completions`.
- [ ] Use `QWEN_MODEL || "qwen-plus"`.
- [ ] Normalize the model response into the same `FraudReview` response shape.
- [ ] Return deterministic fallback JSON if the key is missing or Qwen fails.

### Task 3: Fraud Agent UI Step

**Files:**
- Create: `src/components/FraudAgentPanel.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/ProgressBar.tsx`
- Modify: `src/components/DemoGuideDialog.tsx`

- [ ] Insert a new `AI Agent` workflow step between proof and contract.
- [ ] Show loading, live Qwen result, and fallback result states.
- [ ] Shift contract decision to step 5 and action to step 6.
- [ ] Add a tour target for the fraud-review step.

### Task 4: Docs And Verification

**Files:**
- Modify: `README.md`
- Modify: `src/__tests__/app-flow.test.tsx`

- [ ] Document Qwen environment variables for Vercel.
- [ ] Update app-flow tests for the 6-step workflow.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Commit and push the working feature.

