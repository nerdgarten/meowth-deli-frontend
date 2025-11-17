import { expect, test, type Locator, type Page } from "@playwright/test";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type UserRole = "customer" | "restaurant" | "driver";
type LabelQuery = string | RegExp;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.resolve(__dirname, "../fixtures");
const assetsDir = path.resolve(__dirname, "../assets");

const successToastText = "Profile updated successfully!";

const credentials: Record<UserRole, { email: string; password: string }> = {
  customer: { email: "customer@example.com", password: "111111" },
  restaurant: { email: "restaurant@example.com", password: "Password123!" },
  driver: { email: "driver@example.com", password: "Password123!" },
};

const routeFallbacks = {
  customerProfile: ["/customer/profile", "/settings"],
  restaurantProfile: ["/restaurant/profile", "/settings"],
  driverProfile: ["/driver/profile", "/settings"],
  customerAddresses: ["/customer/addresses", "/settings/addresses"],
} as const;

const testAssetPath = (fileName: string) => {
  const fixtureCandidate = path.join(fixturesDir, fileName);
  if (existsSync(fixtureCandidate)) {
    return fixtureCandidate;
  }
  const assetCandidate = path.join(assetsDir, fileName);
  if (existsSync(assetCandidate)) {
    return assetCandidate;
  }
  throw new Error(
    `Unable to find "${fileName}" in ${fixturesDir} or ${assetsDir}.`
  );
};

const customerProfileHeading = (page: Page) =>
  page.getByRole("heading", { name: /Profile Information/i });
const restaurantProfileHeading = (page: Page) =>
  page.getByRole("heading", { name: /Store Profile/i });
const driverProfileHeading = customerProfileHeading;
const addressHeading = (page: Page) =>
  page.getByRole("heading", { name: /Delivery Addresses/i });

async function loginAs(page: Page, role: UserRole) {
  await page.goto("/");
  const userButton = page.locator("nav button").first();
  await expect(userButton).toBeVisible();
  await userButton.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  const { email, password } = credentials[role];
  await dialog.getByLabel("Email").fill(email);
  await dialog.getByLabel("Password").fill(password);
  await dialog.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Login successful!")).toBeVisible({
    timeout: 15_000,
  });
  await expect(dialog).toBeHidden({ timeout: 15_000 });
  await page.waitForLoadState("networkidle").catch(() => undefined);
}

async function gotoWithFallback(
  page: Page,
  paths: readonly string[],
  locatorFactory: () => Locator
) {
  let lastError: unknown = undefined;
  for (const path of paths) {
    try {
      await page.goto(path);
      await page.waitForLoadState("networkidle").catch(() => undefined);
      await locatorFactory().waitFor({ state: "visible", timeout: 5_000 });
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error(`Unable to reach   route: ${paths.join(", ")}`);
}

async function gotoCustomerProfile(page: Page) {
  await gotoWithFallback(page, routeFallbacks.customerProfile, () =>
    customerProfileHeading(page)
  );
}

async function gotoRestaurantProfile(page: Page) {
  await gotoWithFallback(page, routeFallbacks.restaurantProfile, () =>
    restaurantProfileHeading(page)
  );
}

async function gotoDriverProfile(page: Page) {
  await gotoWithFallback(page, routeFallbacks.driverProfile, () =>
    driverProfileHeading(page)
  );
}

async function gotoCustomerAddresses(page: Page) {
  await gotoWithFallback(page, routeFallbacks.customerAddresses, () =>
    addressHeading(page)
  );
}

async function reloadSection(page: Page, locatorFactory: () => Locator) {
  await page.reload();
  await locatorFactory().waitFor({ state: "visible", timeout: 5_000 });
}

async function getInputByLabel(
  page: Page,
  labels: LabelQuery | LabelQuery[]
): Promise<Locator> {
  const options = Array.isArray(labels) ? labels : [labels];
  for (const label of options) {
    const locator =
      typeof label === "string"
        ? page.getByLabel(label)
        : page.getByLabel(label);
    if ((await locator.count()) > 0) {
      return locator;
    }
  }
  const labelList = options
    .map((label) => (typeof label === "string" ? label : label.toString()))
    .join(", ");
  throw new Error(`Unable to find input with labels: ${labelList}`);
}

async function fillInputByLabel(
  page: Page,
  labels: LabelQuery | LabelQuery[],
  value: string
) {
  const locator = await getInputByLabel(page, labels);
  await locator.fill(value);
  return locator;
}

async function getInputValue(page: Page, labels: LabelQuery | LabelQuery[]) {
  const locator = await getInputByLabel(page, labels);
  return locator.inputValue();
}

async function uploadFileByLabel(
  page: Page,
  labels: LabelQuery | LabelQuery[],
  fileName: string
) {
  const locator = await getInputByLabel(page, labels);
  await locator.setInputFiles(testAssetPath(fileName));
}

async function expectFieldError(
  page: Page,
  labels: LabelQuery | LabelQuery[],
  message: RegExp
) {
  const input = await getInputByLabel(page, labels);
  const fieldId = await input.getAttribute("id");
  if (!fieldId) {
    throw new Error("Unable to locate validation message for field.");
  }
  const errorLocator = page.locator(`#${fieldId}-form-item-message`);
  await expect(errorLocator).toHaveText(message);
}

async function expectToast(page: Page, text: string | RegExp) {
  const toast =
    typeof text === "string"
      ? page.getByText(text, { exact: true })
      : page.getByText(text);
  await expect(toast).toBeVisible({ timeout: 10_000 });
}

async function expectNoToast(page: Page, text: string | RegExp) {
  const toast =
    typeof text === "string"
      ? page.getByText(text, { exact: true })
      : page.getByText(text);
  await expect(toast).toHaveCount(0, { timeout: 3_000 });
}

type CustomerProfileValues = {
  firstName: string;
  lastName: string;
  phone: string;
};

async function captureCustomerProfile(
  page: Page
): Promise<CustomerProfileValues> {
  return {
    firstName: await getInputValue(page, "First Name"),
    lastName: await getInputValue(page, "Last Name"),
    phone: await getInputValue(page, "Phone"),
  };
}

async function updateCustomerProfile(
  page: Page,
  data: Partial<CustomerProfileValues> & { photoFile?: string }
) {
  if (data.firstName !== undefined) {
    await fillInputByLabel(page, "First Name", data.firstName);
  }
  if (data.lastName !== undefined) {
    await fillInputByLabel(page, "Last Name", data.lastName);
  }
  if (data.phone !== undefined) {
    await fillInputByLabel(page, "Phone", data.phone);
  }
  if (data.photoFile) {
    await uploadFileByLabel(
      page,
      [/Profile Picture/i, /Profile Photo/i],
      data.photoFile
    );
  }
}

async function expectCustomerProfileValues(
  page: Page,
  expected: Partial<CustomerProfileValues>
) {
  if (expected.firstName !== undefined) {
    await expect(await getInputByLabel(page, "First Name")).toHaveValue(
      expected.firstName
    );
  }
  if (expected.lastName !== undefined) {
    await expect(await getInputByLabel(page, "Last Name")).toHaveValue(
      expected.lastName
    );
  }
  if (expected.phone !== undefined) {
    await expect(await getInputByLabel(page, "Phone")).toHaveValue(
      expected.phone
    );
  }
}

async function revertCustomerProfile(
  page: Page,
  values: CustomerProfileValues
) {
  try {
    await updateCustomerProfile(page, values);
    await submitProfileForm(page);
    await expectToast(page, successToastText);
  } catch (error) {
    console.warn("Failed to revert customer profile", error);
  }
}

type RestaurantProfileValues = {
  name: string;
  about: string;
  address: string;
  phone: string;
};

async function captureRestaurantProfile(
  page: Page
): Promise<RestaurantProfileValues> {
  return {
    name: await getInputValue(page, /Restaurant Name/i),
    about: await getInputValue(page, /About/i),
    address: await getInputValue(page, [/Address/i, /Location/i]),
    phone: await getInputValue(page, /Phone/i),
  };
}

async function updateRestaurantProfile(
  page: Page,
  data: Partial<RestaurantProfileValues> & { logoFile?: string }
) {
  if (data.name !== undefined) {
    await fillInputByLabel(page, /Restaurant Name/i, data.name);
  }
  if (data.about !== undefined) {
    await fillInputByLabel(page, /About/i, data.about);
  }
  if (data.address !== undefined) {
    await fillInputByLabel(page, [/Address/i, /Location/i], data.address);
  }
  if (data.phone !== undefined) {
    await fillInputByLabel(page, /Phone/i, data.phone);
  }
  if (data.logoFile) {
    await uploadFileByLabel(
      page,
      [/Upload Logo/i, /Profile Picture/i],
      data.logoFile
    );
  }
}

async function expectRestaurantProfileValues(
  page: Page,
  expected: Partial<RestaurantProfileValues>
) {
  if (expected.name !== undefined) {
    await expect(await getInputByLabel(page, /Restaurant Name/i)).toHaveValue(
      expected.name
    );
  }
  if (expected.about !== undefined) {
    await expect(await getInputByLabel(page, /About/i)).toHaveValue(
      expected.about
    );
  }
  if (expected.address !== undefined) {
    await expect(
      await getInputByLabel(page, [/Address/i, /Location/i])
    ).toHaveValue(expected.address);
  }
  if (expected.phone !== undefined) {
    await expect(await getInputByLabel(page, /Phone/i)).toHaveValue(
      expected.phone
    );
  }
}

async function revertRestaurantProfile(
  page: Page,
  values: RestaurantProfileValues
) {
  try {
    await updateRestaurantProfile(page, values);
    await submitProfileForm(page);
    await expectToast(page, successToastText);
  } catch (error) {
    console.warn("Failed to revert restaurant profile", error);
  }
}

type DriverProfileValues = {
  displayName: string;
  phone: string;
  bio: string;
};

async function captureDriverProfile(page: Page): Promise<DriverProfileValues> {
  return {
    displayName: await getInputValue(page, /Display Name/i),
    phone: await getInputValue(page, /Phone/i),
    bio: await getInputValue(page, [/Bio/i, /Notes/i]),
  };
}

async function updateDriverProfile(
  page: Page,
  data: Partial<DriverProfileValues> & { photoFile?: string }
) {
  if (data.displayName !== undefined) {
    await fillInputByLabel(page, /Display Name/i, data.displayName);
  }
  if (data.phone !== undefined) {
    await fillInputByLabel(page, /Phone/i, data.phone);
  }
  if (data.bio !== undefined) {
    await fillInputByLabel(page, [/Bio/i, /Notes/i], data.bio);
  }
  if (data.photoFile) {
    await uploadFileByLabel(
      page,
      [/Profile Photo/i, /Profile Picture/i],
      data.photoFile
    );
  }
}

async function expectDriverProfileValues(
  page: Page,
  expected: Partial<DriverProfileValues>
) {
  if (expected.displayName !== undefined) {
    await expect(await getInputByLabel(page, /Display Name/i)).toHaveValue(
      expected.displayName
    );
  }
  if (expected.phone !== undefined) {
    await expect(await getInputByLabel(page, /Phone/i)).toHaveValue(
      expected.phone
    );
  }
  if (expected.bio !== undefined) {
    await expect(await getInputByLabel(page, [/Bio/i, /Notes/i])).toHaveValue(
      expected.bio
    );
  }
}

async function revertDriverProfile(page: Page, values: DriverProfileValues) {
  try {
    await updateDriverProfile(page, values);
    await submitProfileForm(page);
    await expectToast(page, successToastText);
  } catch (error) {
    console.warn("Failed to revert driver profile", error);
  }
}

async function uploadDriverLicense(page: Page, fileName: string) {
  const labelCandidates: LabelQuery[] = [
    /Driver.?s License/i,
    /License/i,
    /Upload File/i,
  ];
  for (const label of labelCandidates) {
    const locator = page.getByLabel(label);
    if ((await locator.count()) > 0) {
      await locator.setInputFiles(testAssetPath(fileName));
      return;
    }
  }
  const pdfInput = page.locator('input[type="file"][accept*="pdf"]');
  if ((await pdfInput.count()) > 0) {
    await pdfInput.first().setInputFiles(testAssetPath(fileName));
    return;
  }
  throw new Error("Unable to find driver license upload input.");
}

async function submitProfileForm(page: Page) {
  await page.getByRole("button", { name: "Save Changes" }).click();
}

async function expectFileUploadError(page: Page) {
  const error = page
    .getByText(
      /(cannot be uploaded|invalid file|file upload failed|Not a file)/i
    )
    .first();
  await expect(error).toBeVisible({ timeout: 5_000 });
}

test.describe("User Story 2-1: Customer updates profile", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await loginAs(page, "customer");
    await gotoCustomerProfile(page);
  });

  test("TC5-1: customer can update profile with valid data", async ({
    page,
  }) => {
    const original = await captureCustomerProfile(page);
    try {
      await updateCustomerProfile(page, {
        firstName: "John",
        lastName: "Cena",
        phone: "+66 92 345 6789",
        photoFile: "profile_asset.png",
      });
      await submitProfileForm(page);
      await expectToast(page, successToastText);
      await reloadSection(page, () => customerProfileHeading(page));
      await expectCustomerProfileValues(page, {
        firstName: "John",
        lastName: "Cena",
        phone: "+66 92 345 6789",
      });
      await expect(page.getByAltText("Profile")).toBeVisible();
    } finally {
      await revertCustomerProfile(page, original);
    }
  });

  test("TC5-2: empty first name shows validation error and blocks save", async ({
    page,
  }) => {
    const original = await captureCustomerProfile(page);
    await updateCustomerProfile(page, {
      firstName: "",
      lastName: "Cena",
      phone: "+66 92 345 6789",
      photoFile: "profile_asset.png",
    });
    await submitProfileForm(page);
    await expectFieldError(page, "First Name", /(cannot be empty|required)/i);
    await expectNoToast(page, successToastText);
    await reloadSection(page, () => customerProfileHeading(page));
    await expectCustomerProfileValues(page, original);
  });

  test("TC5-3: invalid phone format is rejected", async ({ page }) => {
    const original = await captureCustomerProfile(page);
    await updateCustomerProfile(page, {
      firstName: "John",
      lastName: "Cena",
      phone: "+5 6789",
      photoFile: "profile_asset.png",
    });
    await submitProfileForm(page);
    await expectFieldError(page, "Phone", /invalid phone/i);
    await expectNoToast(page, successToastText);
    await reloadSection(page, () => customerProfileHeading(page));
    await expectCustomerProfileValues(page, original);
  });

  test("TC5-4: invalid photo type is rejected before submitting", async ({
    page,
  }) => {
    const original = await captureCustomerProfile(page);
    await updateCustomerProfile(page, {
      firstName: "John",
      lastName: "Cena",
      phone: "+66 95 488 6789",
      photoFile: "profile.txt",
    });
    await submitProfileForm(page);
    await expectFileUploadError(page);
    await expectNoToast(page, successToastText);
    await reloadSection(page, () => customerProfileHeading(page));
    await expectCustomerProfileValues(page, original);
  });
});

test.describe("User Story 2-2: Restaurant updates profile", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await loginAs(page, "restaurant");
    await gotoRestaurantProfile(page);
  });

  test("TC6-1: restaurant can update profile with valid inputs", async ({
    page,
  }) => {
    const original = await captureRestaurantProfile(page);
    try {
      await updateRestaurantProfile(page, {
        name: "Meowth Cafe",
        about: "Serving fresh meals every day.",
        address: "123 Meow Street, Bangkok 10200",
        phone: "+66 81 234 5678",
        logoFile: "logo.png",
      });
      await submitProfileForm(page);
      await expectToast(page, successToastText);
      await reloadSection(page, () => restaurantProfileHeading(page));
      await expectRestaurantProfileValues(page, {
        name: "Meowth Cafe",
        about: "Serving fresh meals every day.",
        address: "123 Meow Street, Bangkok 10200",
        phone: "+66 81 234 5678",
      });
    } finally {
      await revertRestaurantProfile(page, original);
    }
  });

  test("TC6-2: empty restaurant name triggers validation error", async ({
    page,
  }) => {
    const original = await captureRestaurantProfile(page);
    await updateRestaurantProfile(page, {
      name: "",
      about: "Serving fresh meals every day.",
      address: "123 Meow Street, Bangkok 10200",
      phone: "+66 81 234 5678",
      logoFile: "logo.png",
    });
    await submitProfileForm(page);
    await expectFieldError(
      page,
      /Restaurant Name/i,
      /(cannot be empty|required)/i
    );
    await expectNoToast(page, successToastText);
    await reloadSection(page, () => restaurantProfileHeading(page));
    await expectRestaurantProfileValues(page, original);
  });

  test("TC6-3: empty address is rejected", async ({ page }) => {
    const original = await captureRestaurantProfile(page);
    await updateRestaurantProfile(page, {
      name: "Meowth Cafe",
      about: "Serving fresh meals every day.",
      address: "",
      phone: "+66 81 234 5678",
      logoFile: "logo.png",
    });
    await submitProfileForm(page);
    await expectFieldError(
      page,
      [/Address/i, /Location/i],
      /(cannot be empty|required)/i
    );
    await expectNoToast(page, successToastText);
    await reloadSection(page, () => restaurantProfileHeading(page));
    await expectRestaurantProfileValues(page, original);
  });

  test("TC6-4: invalid phone format blocks save", async ({ page }) => {
    const original = await captureRestaurantProfile(page);
    await updateRestaurantProfile(page, {
      name: "Meowth Cafe",
      about: "Serving fresh meals every day.",
      address: "123 Meow Street, Bangkok 10200",
      phone: "7823",
      logoFile: "logo.png",
    });
    await submitProfileForm(page);
    await expectFieldError(page, /Phone/i, /invalid phone/i);
    await expectNoToast(page, successToastText);
    await reloadSection(page, () => restaurantProfileHeading(page));
    await expectRestaurantProfileValues(page, original);
  });

  test("TC6-5: invalid logo file is rejected", async ({ page }) => {
    const original = await captureRestaurantProfile(page);
    await updateRestaurantProfile(page, {
      name: "Meowth Cafe",
      about: "Serving fresh meals every day.",
      address: "123 Meow Street, Bangkok 10200",
      phone: "+66 81 234 5678",
      logoFile: "profile.txt",
    });
    await submitProfileForm(page);
    await expectFileUploadError(page);
    await expectNoToast(page, successToastText);
    await reloadSection(page, () => restaurantProfileHeading(page));
    await expectRestaurantProfileValues(page, original);
  });
});

test.describe("User Story 2-3: Driver updates profile and license", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await loginAs(page, "driver");
    await gotoDriverProfile(page);
  });

  test("TC7-1: driver can update profile fields and photo", async ({
    page,
  }) => {
    const original = await captureDriverProfile(page);
    try {
      await updateDriverProfile(page, {
        displayName: "Meowth Driver",
        phone: "+66 81 234 5678",
        bio: "Food enthusiast and experienced delivery driver.",
        photoFile: "profile_asset.png",
      });
      await submitProfileForm(page);
      await expectToast(page, successToastText);
      await reloadSection(page, () => driverProfileHeading(page));
      await expectDriverProfileValues(page, {
        displayName: "Meowth Driver",
        phone: "+66 81 234 5678",
        bio: "Food enthusiast and experienced delivery driver.",
      });
      await expect(page.getByAltText("Profile")).toBeVisible();
    } finally {
      await revertDriverProfile(page, original);
    }
  });

  test("TC7-2: empty display name prevents save", async ({ page }) => {
    const original = await captureDriverProfile(page);
    await updateDriverProfile(page, {
      displayName: "",
      phone: "+66 81 234 5678",
      bio: "Food enthusiast and experienced delivery driver.",
      photoFile: "profile_asset.png",
    });
    await submitProfileForm(page);
    await expectFieldError(
      page,
      /Display Name/i,
      /(cannot be empty|required)/i
    );
    await expectNoToast(page, successToastText);
    await reloadSection(page, () => driverProfileHeading(page));
    await expectDriverProfileValues(page, original);
  });

  test("TC7-3: invalid driver phone is rejected", async ({ page }) => {
    const original = await captureDriverProfile(page);
    await updateDriverProfile(page, {
      displayName: "Meowth Driver",
      phone: "+678",
      bio: "Food enthusiast and experienced delivery driver.",
      photoFile: "profile_asset.png",
    });
    await submitProfileForm(page);
    await expectFieldError(page, /Phone/i, /invalid phone/i);
    await expectNoToast(page, successToastText);
    await reloadSection(page, () => driverProfileHeading(page));
    await expectDriverProfileValues(page, original);
  });

  test("TC7-4: invalid profile photo file type is rejected", async ({
    page,
  }) => {
    const original = await captureDriverProfile(page);
    await updateDriverProfile(page, {
      displayName: "Meowth Driver",
      phone: "+66 97 948 9398",
      bio: "Food enthusiast and experienced delivery driver.",
      photoFile: "profile.txt",
    });
    await submitProfileForm(page);
    await expectFileUploadError(page);
    await expectNoToast(page, successToastText);
    await reloadSection(page, () => driverProfileHeading(page));
    await expectDriverProfileValues(page, original);
  });

  test("TC7-5: driver can upload license PDF file", async ({ page }) => {
    await page.route("**/driver/upload", async (route) => {
      await route.fulfill({ status: 200, body: "{}" });
    });
    try {
      await uploadDriverLicense(page, "license_asset.pdf");
      await expectToast(page, /File uploaded successfully!/i);
    } finally {
      await page.unroute("**/driver/upload");
    }
  });

  test("TC7-6: invalid driver license file upload is rejected", async ({
    page,
  }) => {
    await uploadDriverLicense(page, "license.txt");
    await expectFileUploadError(page);
    await expectNoToast(page, /uploaded successfully/i);
  });
});

test.describe("User Story 2-4: Customer adds delivery address", () => {
  test.describe.configure({ mode: "serial" });
  test.use({
    permissions: ["geolocation"],
    geolocation: { latitude: 13.7563, longitude: 100.5018 },
  });

  const addressText = "123 Meow Street, Bangkok, 10200";

  test.beforeEach(async ({ page }) => {
    await loginAs(page, "customer");
    await gotoCustomerAddresses(page);
  });

  test("TC8-1: customer can add a new address", async ({ page }) => {
    const addressLocator = page.getByText(addressText, { exact: true });
    const countBefore = await addressLocator.count();

    await page.getByRole("button", { name: "+ Add New Address" }).click();
    const panelSaveButton = page.getByRole("button", { name: /Save Address/i });
    await expect(panelSaveButton).toBeVisible();
    await fillInputByLabel(page, /Address/i, addressText);
    await panelSaveButton.click();
    await expect(panelSaveButton).toBeHidden({ timeout: 10_000 });
    await expect(addressLocator).toHaveCount(countBefore + 1, {
      timeout: 10_000,
    });
  });

  test("TC8-2: empty address shows validation error and is not added", async ({
    page,
  }) => {
    const addressLocator = page.getByText(addressText, { exact: true });
    const countBefore = await addressLocator.count();

    await page.getByRole("button", { name: "+ Add New Address" }).click();
    const panelSaveButton = page.getByRole("button", { name: /Save Address/i });
    await expect(panelSaveButton).toBeVisible();
    await panelSaveButton.click();
    await expectFieldError(page, /Address/i, /cannot be empty/i);
    await expect(panelSaveButton).toBeVisible();
    await expect(addressLocator).toHaveCount(countBefore);
    await page.getByRole("button", { name: "✕" }).click();
  });
});
