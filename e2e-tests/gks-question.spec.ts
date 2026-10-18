import { expect, test } from "@playwright/test";

test("asks a GKS question and receives guidance", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "What can I help you with?" })).toBeVisible();
  await page.getByRole("button", { name: /GPA & age requirements/ }).click();
  await expect(page.getByRole("textbox", { name: "Your GKS question" })).toHaveValue("GPA & age requirements");
  await expect(page.getByRole("button", { name: /What degree do I need for GKS Graduate?/ })).toBeVisible();
  await page.getByRole("button", { name: "Send question" }).click();

  await expect(page.getByText("You", { exact: true })).toBeVisible();
  await expect(page.getByText(/GKS|eligibility|official/i).last()).toBeVisible();
  await expect(page.getByRole("button", { name: "Clear conversation" })).toBeVisible();

  await page.getByRole("textbox", { name: "Your GKS question" }).fill("how is that");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText(/Embassy Track is submitted to the Korean diplomatic mission/i)).toBeVisible();
});
