import { test, expect } from "@playwright/test";

test("AI Study Assistant primary flow", async ({ page }) => {
  // Mock the AI API — never call the real API
  await page.route("**/api/chat", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/plain",
      body: "Binary search is an efficient searching algorithm that works on sorted data.",
    });
  });

  await page.goto("/ai-assistant");

  // Page loads
  await expect(
    page.getByRole("heading", {
      name: /AI Study Assistant/i,
    })
  ).toBeVisible();

  // Find chat input
  const input = page.getByPlaceholder(
    /Ask your AI study assistant/i
  );

  await expect(input).toBeVisible();

  // User types a message
  await input.fill(
    "Explain binary search in simple words."
  );

  // Verify the input contains the message
  await expect(input).toHaveValue(
    "Explain binary search in simple words."
  );

  // Send button should now be enabled
  const sendButton = page.getByRole("button", {
    name: /send/i,
  });

  await expect(sendButton).toBeEnabled();

  // Send message
  await sendButton.click();

  // User message should appear in chat
  await expect(
    page.getByText(
      "Explain binary search in simple words."
    )
  ).toBeVisible();
});