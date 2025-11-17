import { expect, test, type Page } from "@playwright/test";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type RegistrationRole = "customer" | "driver" | "restaurant";

type Credentials = {
  email: string;
  password: string;
  confirmPassword?: string;
};

type PersonDetails = {
  firstname?: string;
  lastname?: string;
  tel?: string;
  location?: string;
  agreeTOS?: boolean;
  agreePDPA?: boolean;
};

type RestaurantDetails = {
  name?: string;
  description?: string;
  tel?: string;
  location?: string;
  agreeTOS?: boolean;
  agreePDPA?: boolean;
};

type UserRole = "customer" | "driver" | "restaurant";

const registerPaths: Record<RegistrationRole, string> = {
  customer: "/register/customer",
  driver: "/register/driver",
  restaurant: "/register/restaurant",
};

const loginCredentials: Record<UserRole, { email: string; password: string }> =
  {
    customer: { email: "customer@example.com", password: "111111" },
    restaurant: { email: "restaurant@example.com", password: "111111" },
    driver: { email: "driver@example.com", password: "111111" },
  };

const defaultCredentials: Credentials = {
  email: "meowth@gmail.com",
  password: "123456",
  confirmPassword: "123456",
};

const defaultPersonDetails: Required<PersonDetails> = {
  firstname: "meowth",
  lastname: "delivery",
  tel: "+66123456789",
  location: "123 Cat Street, Bangkok",
  agreeTOS: true,
  agreePDPA: true,
};

const defaultRestaurantDetails: Required<RestaurantDetails> = {
  name: "Meowth Cuisine",
  description: "Serving hot meals with extra care.",
  tel: "+66234567890",
  location: "42 Kitty Plaza, Bangkok",
  agreeTOS: true,
  agreePDPA: true,
};

const successRegistrationToast = "Register successfully!";
const logoutToastText = "Logged Out";
const profileSaveToast = "Profile updated successfully!";
const uploadToastText = "File uploaded successfully!";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, "../assets");
const licensePdfPath = path.join(assetsDir, "license_asset.pdf");

if (!existsSync(licensePdfPath)) {
  throw new Error(
    `Missing license fixture at ${licensePdfPath}. Please add tests/assets/license_asset.pdf`
  );
}

function uniqueEmail(base: string, seed: string) {
  const [user, domain] = base.split("@");
  const rand = Math.random().toString(36).slice(-4);
  return `${user}+${seed}-${Date.now()}-${rand}@${domain}`;
}

async function goToRegistration(page: Page, role: RegistrationRole) {
  await page.goto(registerPaths[role]);
  await page
    .getByRole("heading", { name: /create your account/i })
    .waitFor({ state: "visible" });
}

async function fillCredentials(
  page: Page,
  overrides: Partial<Credentials> = {}
) {
  const values = { ...defaultCredentials, ...overrides };
  await page.getByLabel(/email/i).fill(values.email);
  await page.getByLabel(/^password$/i).fill(values.password);
  const confirm =
    values.confirmPassword === undefined
      ? values.password
      : values.confirmPassword;
  await page.getByLabel(/confirm password/i).fill(confirm);
}

async function continueToDetailsStep(
  page: Page,
  role: RegistrationRole,
  timeout = 10_000
) {
  await page.getByRole("button", { name: /continue/i }).click();
  if (role === "restaurant") {
    await page
      .getByLabel(/restaurant name/i)
      .waitFor({ state: "visible", timeout });
  } else {
    await page.getByLabel(/firstname/i).waitFor({ state: "visible", timeout });
  }
}

async function fillPersonDetails(page: Page, overrides: PersonDetails = {}) {
  const values: PersonDetails = { ...defaultPersonDetails, ...overrides };
  if (values.firstname !== undefined) {
    const firstInput = page.getByLabel(/firstname/i);
    await firstInput.fill(values.firstname);
  }
  if (values.lastname !== undefined) {
    const lastInput = page.getByLabel(/lastname/i);
    await lastInput.fill(values.lastname);
  }
  if (values.tel !== undefined) {
    const phoneInput = page.locator("#tel");
    await phoneInput.fill(values.tel);
  }
  if (values.location !== undefined) {
    await page.getByLabel(/address/i).fill(values.location);
  }
  if (values.agreeTOS !== undefined) {
    await setCheckboxState(page, /terms of service/i, values.agreeTOS);
  }
  if (values.agreePDPA !== undefined) {
    await setCheckboxState(page, /pdpa/i, values.agreePDPA);
  }
}

async function fillRestaurantDetails(
  page: Page,
  overrides: RestaurantDetails = {}
) {
  const values: RestaurantDetails = {
    ...defaultRestaurantDetails,
    ...overrides,
  };
  if (values.name !== undefined) {
    await page.getByLabel(/restaurant name/i).fill(values.name);
  }
  if (values.description !== undefined) {
    await page.getByLabel(/description/i).fill(values.description);
  }
  if (values.tel !== undefined) {
    await page.locator("#tel").fill(values.tel);
  }
  if (values.location !== undefined) {
    await page.getByLabel(/address/i).fill(values.location);
  }
  if (values.agreeTOS !== undefined) {
    await setCheckboxState(page, /terms of service/i, values.agreeTOS);
  }
  if (values.agreePDPA !== undefined) {
    await setCheckboxState(page, /pdpa/i, values.agreePDPA);
  }
}

async function setCheckboxState(
  page: Page,
  name: string | RegExp,
  checked: boolean
) {
  const checkbox = page.getByRole("checkbox", { name });
  await expect(checkbox).toBeVisible();
  const current = await checkbox.getAttribute("data-state");
  const isChecked = current === "checked";
  if (isChecked !== checked) {
    await checkbox.click();
  }
}

async function submitRegistration(page: Page) {
  await page.getByRole("button", { name: /create account/i }).click();
}

async function expectRegistrationSucceeded(page: Page) {
  const successToast = page.getByText(successRegistrationToast);
  await Promise.race([
    successToast.waitFor({ state: "visible", timeout: 20_000 }),
    page.waitForFunction(
      () => !window.location.pathname.startsWith("/register"),
      undefined,
      { timeout: 20_000 }
    ),
  ]);
}

async function expectStillOnRegister(page: Page, role: RegistrationRole) {
  const escaped = registerPaths[role].replace(/\//g, "\\/");
  await expect(page).toHaveURL(new RegExp(`${escaped}(?:$|\\/)`));
}

async function loginAs(page: Page, role: UserRole) {
  await page.goto("/");
  const userButton = page.locator("nav button").nth(1);
  await expect(userButton).toBeVisible();
  await userButton.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const creds = loginCredentials[role];
  await dialog.getByLabel("Email").fill(creds.email);
  await dialog.getByLabel("Password").fill(creds.password);
  await dialog.getByRole("button", { name: /login/i }).click();
  await expect(page.getByText("Login successful!")).toBeVisible({
    timeout: 15_000,
  });
  await expect(dialog).toBeHidden({ timeout: 15_000 });
  await page.waitForLoadState("networkidle").catch(() => undefined);
}

async function ensureDriverProfileSettings(page: Page) {
  await page.goto("/settings");
  await page
    .getByRole("heading", { name: /profile information/i })
    .waitFor({ state: "visible" });
}

test.describe("Epic 1 – Registration, Logout, Consents, License Upload", () => {
  // User Story 1-1
  // TC1-1: Valid registration – role Customer, all fields valid
  test("TC1-1: Customer registers successfully", async ({ page }) => {
    await goToRegistration(page, "customer");
    await fillCredentials(page, {
      email: uniqueEmail("meowth@gmail.com", "tc1-1"),
      password: "123456",
      confirmPassword: "123456",
    });
    await continueToDetailsStep(page, "customer");
    await fillPersonDetails(page, {
      firstname: "meowth",
      lastname: "delivery",
      tel: "+66123456789",
      location: "123 Cat Street, Bangkok",
      agreePDPA: true,
      agreeTOS: true,
    });
    await submitRegistration(page);
    await expectRegistrationSucceeded(page);
    await expect(page.getByText(successRegistrationToast)).toBeVisible();
  });

  // User Story 1-1
  // TC1-2: Driver registration missing first name should show validation error
  test("TC1-2: Driver registration fails without first name", async ({
    page,
  }) => {
    await goToRegistration(page, "driver");
    await fillCredentials(page, {
      email: "meowth@gmail.com",
      password: "123456",
      confirmPassword: "123456",
    });
    await continueToDetailsStep(page, "driver");
    await fillPersonDetails(page, {
      firstname: "",
      lastname: "delivery",
      tel: "+66123456789",
      location: "123 Cat Street, Bangkok",
      agreePDPA: true,
      agreeTOS: true,
    });
    await submitRegistration(page);
    await expect(page.getByText("First name is required")).toBeVisible();
    await expectStillOnRegister(page, "driver");
  });

  // User Story 1-1
  // TC1-3: Driver registration missing last name should show validation error
  test("TC1-3: Driver registration fails without last name", async ({
    page,
  }) => {
    await goToRegistration(page, "driver");
    await fillCredentials(page, {
      email: "meowth2@gmail.com",
      password: "123456",
      confirmPassword: "123456",
    });
    await continueToDetailsStep(page, "driver");
    await fillPersonDetails(page, {
      firstname: "meowth",
      lastname: "",
      tel: "+66123456789",
      location: "123 Cat Street, Bangkok",
      agreePDPA: true,
      agreeTOS: true,
    });
    await submitRegistration(page);
    await expect(page.getByText("Lastname is required")).toBeVisible();
    await expectStillOnRegister(page, "driver");
  });

  // User Story 1-1
  // TC1-4: Invalid email format blocks restaurant registration
  test("TC1-4: Restaurant registration fails with invalid email", async ({
    page,
  }) => {
    await goToRegistration(page, "restaurant");
    await fillCredentials(page, {
      email: "meowth&hdi.com",
      password: "123456",
      confirmPassword: "123456",
    });
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByText(/invalid email/i)).toBeVisible();
    await expectStillOnRegister(page, "restaurant");
  });

  // User Story 1-1
  // TC1-5: Password too short should show validation error
  test("TC1-5: Registration fails when password is too short", async ({
    page,
  }) => {
    await goToRegistration(page, "customer");
    await fillCredentials(page, {
      email: "meowth@gmail.com",
      password: "12345",
      confirmPassword: "12345",
    });
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(
      page.getByText("Password must be at least 6 characters")
    ).toBeVisible();
    await expectStillOnRegister(page, "customer");
  });

  // User Story 1-1
  // TC1-6: Password/confirm mismatch should stop submission
  test("TC1-6: Registration fails when confirm password mismatches", async ({
    page,
  }) => {
    await goToRegistration(page, "customer");
    await fillCredentials(page, {
      email: "meowth@gmail.com",
      password: "123456",
      confirmPassword: "12345678",
    });
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByText("Passwords do not match")).toBeVisible();
    await expectStillOnRegister(page, "customer");
  });

  // User Story 1-3
  // TC2-1: Logout button signs the user out and shows feedback
  test("TC2-1: Logged-in user can logout from the menu dialog", async ({
    page,
  }) => {
    await loginAs(page, "customer");
    const logoutButton = page.locator("nav button").nth(2);
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();
    await expect(page.getByText(logoutToastText)).toBeVisible({
      timeout: 10_000,
    });
    await expect(page).toHaveURL(/\/$/);
  });

  // User Story 1-6
  // TC3-1: Registration succeeds when both PDPA and Terms checked
  test("TC3-1: Customer can register when both consents checked", async ({
    page,
  }) => {
    await goToRegistration(page, "customer");
    await fillCredentials(page, {
      email: uniqueEmail("meowth@gmail.com", "tc3-1"),
    });
    await continueToDetailsStep(page, "customer");
    await fillPersonDetails(page, {
      agreePDPA: true,
      agreeTOS: true,
    });
    await submitRegistration(page);
    await expectRegistrationSucceeded(page);
    await expect(
      page.getByText("You must agree to the Terms of Services")
    ).toHaveCount(0);
    await expect(page.getByText("You must agree to PDPA")).toHaveCount(0);
  });

  // User Story 1-6
  // TC3-2: Missing PDPA consent blocks registration
  test("TC3-2: Registration blocked when PDPA unchecked", async ({ page }) => {
    await goToRegistration(page, "customer");
    await fillCredentials(page, {
      email: "meowth+tc3-2@gmail.com",
    });
    await continueToDetailsStep(page, "customer");
    await fillPersonDetails(page, {
      agreePDPA: false,
      agreeTOS: true,
    });
    await submitRegistration(page);
    await expect(page.getByText("You must agree to PDPA")).toBeVisible();
    await expect(
      page.getByText("You must agree to the Terms of Services")
    ).toHaveCount(0);
    await expectStillOnRegister(page, "customer");
  });

  // User Story 1-6
  // TC3-3: Missing Terms consent blocks registration
  test("TC3-3: Registration blocked when Terms unchecked", async ({ page }) => {
    await goToRegistration(page, "customer");
    await fillCredentials(page, {
      email: "meowth+tc3-3@gmail.com",
    });
    await continueToDetailsStep(page, "customer");
    await fillPersonDetails(page, {
      agreePDPA: true,
      agreeTOS: false,
    });
    await submitRegistration(page);
    await expect(
      page.getByText("You must agree to the Terms of Services")
    ).toBeVisible();
    await expect(page.getByText("You must agree to PDPA")).toHaveCount(0);
    await expectStillOnRegister(page, "customer");
  });

  // User Story 1-6
  // TC3-4: Neither PDPA nor Terms checked block registration
  test("TC3-4: Registration blocked when both consents unchecked", async ({
    page,
  }) => {
    await goToRegistration(page, "customer");
    await fillCredentials(page, {
      email: "meowth+tc3-4@gmail.com",
    });
    await continueToDetailsStep(page, "customer");
    await fillPersonDetails(page, {
      agreePDPA: false,
      agreeTOS: false,
    });
    await submitRegistration(page);
    await expect(
      page.getByText("You must agree to the Terms of Services")
    ).toBeVisible();
    await expect(page.getByText("You must agree to PDPA")).toBeVisible();
    await expectStillOnRegister(page, "customer");
  });

  // User Story 1-7
  // TC4-1: Driver uploads a valid PDF license file
  test("TC4-1: Driver can upload license PDF successfully", async ({
    page,
  }) => {
    await loginAs(page, "driver");
    await ensureDriverProfileSettings(page);
    await page.getByLabel(/first name/i).fill("Driver");
    await page.getByLabel(/last name/i).fill("Tester");
    await page.getByLabel(/phone/i).fill("+66112233445");
    await page
      .locator('input[type="file"][accept="application/pdf"]')
      .setInputFiles(licensePdfPath);
    await expect(page.getByText(uploadToastText)).toBeVisible({
      timeout: 10_000,
    });
    await page.getByRole("button", { name: /save changes/i }).click();
    await expect(page.getByText(profileSaveToast)).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("File upload failed!")).toHaveCount(0);
  });

  // User Story 1-7
  // TC4-2: Driver can save profile without uploading license file
  test("TC4-2: Driver can save without uploading license file", async ({
    page,
  }) => {
    await loginAs(page, "driver");
    await ensureDriverProfileSettings(page);
    await page.getByLabel(/first name/i).fill("Driver");
    await page.getByLabel(/last name/i).fill("Tester");
    await page.getByLabel(/phone/i).fill("+66112233445");
    await page.getByRole("button", { name: /save changes/i }).click();
    await expect(page.getByText(profileSaveToast)).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("File upload failed!")).toHaveCount(0);
  });
});
