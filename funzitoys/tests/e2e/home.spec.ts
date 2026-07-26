import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('loads landing page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
  })
  test('navigates to products page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Shop Now')
    await expect(page).toHaveURL('/products')
  })
})

test.describe('Auth Pages', () => {
  test('customer login page loads', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('text=Welcome Back')).toBeVisible()
  })
  test('owner login page loads', async ({ page }) => {
    await page.goto('/owner/login')
    await expect(page.locator('text=Owner Login')).toBeVisible()
  })
  test('register page loads', async ({ page }) => {
    await page.goto('/register')
    await expect(page.locator('text=Create Account')).toBeVisible()
  })
})
