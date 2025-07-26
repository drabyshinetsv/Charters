/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test, vi, beforeEach } from "vitest";
import { login, signup, logout, getUser } from "./auth";
import { getImages, getImage, createImage } from "./images";

vi.mock("../../auth", () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn().mockImplementation(() => ({
    send: vi.fn().mockResolvedValue({ Contents: [] }),
  })),
  ListObjectsCommand: vi.fn(),
  PutObjectCommand: vi.fn(),
  GetObjectCommand: vi.fn(),
  DeleteObjectCommand: vi.fn(),
}));

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn(),
}));

vi.mock("uuid", () => ({
  v4: vi.fn().mockReturnValue("test-uuid"),
}));

global.fetch = vi.fn();

Object.defineProperty(File.prototype, "arrayBuffer", {
  value: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
  writable: true,
});

beforeEach(() => {
  vi.clearAllMocks();
});

test("login should call signIn with credentials", async () => {
  const { signIn } = await import("../../auth");
  const formData = new FormData();
  formData.append("email", "test@example.com");
  formData.append("password", "password");

  await login(formData);

  expect(signIn).toHaveBeenCalledWith("credentials", formData);
});

test("signup should make POST request to signup API", async () => {
  const mockResponse = {
    ok: true,
    json: vi.fn().mockResolvedValue({ success: true }),
  };
  (global.fetch as any).mockResolvedValue(mockResponse);

  const formData = new FormData();
  formData.append("email", "test@example.com");
  formData.append("password", "password");

  const result = await signup(formData);

  expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "test@example.com",
      password: "password",
      provider: "web",
    }),
  });
  expect(result).toEqual({ success: true });
});

test("logout should call signOut with redirectTo", async () => {
  const { signOut } = await import("../../auth");

  await logout();

  expect(signOut).toHaveBeenCalledWith({ redirectTo: "/signin" });
});

test("getUser should return user when authenticated", async () => {
  const { auth } = await import("../../auth");
  const mockUser = { id: "1", email: "test@example.com" };
  (auth as any).mockResolvedValue({ user: mockUser });

  const result = await getUser();

  expect(result).toEqual(mockUser);
});

test("getUser should throw error when not authenticated", async () => {
  const { auth } = await import("../../auth");
  (auth as any).mockResolvedValue(null);

  await expect(getUser()).rejects.toThrow("Not logged in");
});

test("getImages should call S3 ListObjectsCommand", async () => {
  const { ListObjectsCommand } = await import("@aws-sdk/client-s3");

  const result = await getImages();

  expect(ListObjectsCommand).toHaveBeenCalled();
  expect(result).toBeDefined();
});

test("getImage should return signed URL", async () => {
  const { GetObjectCommand } = await import("@aws-sdk/client-s3");
  const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
  (getSignedUrl as any).mockResolvedValue("https://signed-url.com");

  const result = await getImage("test-id");

  expect(GetObjectCommand).toHaveBeenCalledWith({
    Bucket: undefined,
    Key: "test-id",
  });
  expect(getSignedUrl).toHaveBeenCalled();
  expect(result).toBe("https://signed-url.com");
});

test("createImage should upload files to S3", async () => {
  const { PutObjectCommand } = await import("@aws-sdk/client-s3");

  const formData = new FormData();
  const mockFile = new File(["content"], "test.jpg", { type: "image/jpeg" });
  formData.append("image", mockFile);

  const result = await createImage(formData);

  expect(PutObjectCommand).toHaveBeenCalled();
  expect(result).toEqual(["test-uuid"]);
});

test("createImage should delete old images when provided", async () => {
  const { DeleteObjectCommand, PutObjectCommand } = await import(
    "@aws-sdk/client-s3"
  );

  const formData = new FormData();
  const mockFile = new File(["content"], "test.jpg", { type: "image/jpeg" });
  formData.append("image", mockFile);

  const result = await createImage(formData, ["old-image-1", "old-image-2"]);

  expect(DeleteObjectCommand).toHaveBeenCalledTimes(2);
  expect(PutObjectCommand).toHaveBeenCalled();
  expect(result).toEqual(["test-uuid"]);
});
