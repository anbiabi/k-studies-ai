import { expect, test } from "@playwright/test";

test("asks a GKS question and receives guidance", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "What can I help you with?" })).toBeVisible();
  await page.getByRole("button", { name: "GPA & age requirements" }).click();
  await page.getByRole("button", { name: "Send question" }).click();

  await expect(page.getByText("You", { exact: true })).toBeVisible();
  await expect(page.getByText(/For GKS Graduate applicants/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Clear conversation" })).toBeVisible();
});
