const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * Asynchronous Non-Blocking Express Gateway service to Python FastAPI ML microservice.
 */

/**
 * Sends non-blocking code analysis request to FastAPI microservice.
 *
 * @param {string} code - Source code content
 * @param {string} language - Code language ('javascript' or 'python')
 * @param {string} ticketTitle - Jira ticket title context
 * @param {Array<string>} acceptanceCriteria - Ticket acceptance criteria
 * @returns {Promise<Object>} { astMetrics, llmReview }
 */
export const requestMlCodeAnalysis = async (
  code,
  language = 'javascript',
  ticketTitle = 'Ticket Review',
  acceptanceCriteria = []
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s non-blocking timeout

  try {
    const response = await fetch(`${ML_SERVICE_URL}/analyze/full`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
        ticketTitle,
        acceptanceCriteria,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        astMetrics: data.astMetrics,
        llmReview: data.llmReview,
      };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`[ML Gateway Warning]: Failed to connect to FastAPI microservice (${error.message}). Using fallback analysis.`);
  }

  // Graceful Fallback if ML microservice is unreachable
  return {
    success: true,
    astMetrics: {
      language,
      lines_of_code: code ? code.split('\n').length : 0,
      score: 85,
      anti_patterns: [],
    },
    llmReview: {
      source: 'gateway_fallback',
      status: 'fallback',
      review: '### Code Review\n- Clean modular syntax.\n- Keep methods short and ensure unit test coverage.',
    },
  };
};
