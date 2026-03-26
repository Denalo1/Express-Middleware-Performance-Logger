import { Request, Response, NextFunction } from "express";
import { jest, beforeEach, afterEach, describe, test, expect } from "@jest/globals";
import performanceLogger from "./middleware.js";
import errorLogger from "./errorLogger.js";

// Mock console methods
let consoleLogSpy: ReturnType<typeof jest.spyOn>;
let consoleErrorSpy: ReturnType<typeof jest.spyOn>;

beforeEach(() => {
  consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  jest.clearAllMocks();
});

afterEach(() => {
  consoleLogSpy.mockRestore();
  consoleErrorSpy.mockRestore();
});

describe("Express Middleware Performance Logger Tests", () => {
  /**
   * TEST 1: Performance Logger - Minimal Mode
   * Tests that the middleware correctly logs request/response data in minimal format
   * and measures response time accurately.
   */
  test("performanceLogger should log minimal request/response information with timing", (done) => {
    // Arrange
    const middleware = performanceLogger({ mode: "minimal" });

    const mockReq = {
      method: "GET",
      originalUrl: "/api/users",
      path: "/api/users",
      query: {},
      params: {},
    } as Request;

    const mockRes = {
      statusCode: 200,
      on: jest.fn((event: string, callback: () => void) => {
        if (event === "finish") {
          // Simulate response finishing after a small delay
          setTimeout(callback, 10);
        }
      }),
    } as unknown as Response;

    const mockNext = jest.fn();

    // Act
    middleware(mockReq, mockRes, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalledTimes(1);

    // Wait for the 'finish' event to trigger
    setTimeout(() => {
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const loggedOutput = consoleLogSpy.mock.calls[0][0];

      // Verify minimal format contains required information
      expect(loggedOutput).toContain("[EML]");
      expect(loggedOutput).toContain("GET");
      expect(loggedOutput).toContain("/api/users");
      expect(loggedOutput).toContain("→");
      expect(loggedOutput).toContain("200");
      expect(loggedOutput).toMatch(/\(\d+\.\d{2}ms\)/); // Response time format

      done();
    }, 50);
  });

  /**
   * TEST 2: Performance Logger - Standard Mode with Query and Route Params
   * Tests that the middleware correctly logs additional details including path,
   * query parameters, and route parameters in standard mode format.
   */
  test("performanceLogger in standard mode should log detailed request information including params", (done) => {
    // Arrange
    const middleware = performanceLogger({ mode: "standard" });

    const mockReq = {
      method: "POST",
      originalUrl: "/api/users/123?sort=asc&limit=10",
      path: "/api/users/123",
      query: { sort: "asc", limit: "10" },
      params: { id: "123" },
    } as unknown as Request;

    const mockRes = {
      statusCode: 201,
      on: jest.fn((event: string, callback: () => void) => {
        if (event === "finish") {
          setTimeout(callback, 5);
        }
      }),
    } as unknown as Response;

    const mockNext = jest.fn();

    // Act
    middleware(mockReq, mockRes, mockNext);

    // Assert - verify middleware chain continues
    expect(mockNext).toHaveBeenCalledTimes(1);

    // Wait for the 'finish' event
    setTimeout(() => {
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const loggedOutput = consoleLogSpy.mock.calls[0][0];

      // Verify standard format contains all expected fields
      expect(loggedOutput).toContain("[EML] Request / Response");
      expect(loggedOutput).toContain("Method:        POST");
      expect(loggedOutput).toContain("URL:           /api/users/123?sort=asc&limit=10");
      expect(loggedOutput).toContain("Path:          /api/users/123");
      expect(loggedOutput).toContain('Query Params:  {"sort":"asc","limit":"10"}');
      expect(loggedOutput).toContain('Route Params:  {"id":"123"}');
      expect(loggedOutput).toContain("Status Code:   201");
      expect(loggedOutput).toMatch(/Response Time: \d+\.\d{2}ms/);

      // Verify divider is present
      expect(loggedOutput).toContain("─".repeat(50));

      done();
    }, 50);
  });

  /**
   * TEST 3: Error Logger - Error Handling with Status Codes
   * Tests that the errorLogger middleware correctly captures and logs error details,
   * handles different status code formats, and passes errors to the next middleware.
   */
  test("errorLogger should log error details with correct status code and call next with error", () => {
    // Arrange
    const mockError = new Error("Database connection failed");
    (mockError as any).status = 503;
    mockError.stack = "Error: Database connection failed\n    at DatabaseService.connect";

    const mockReq = {
      method: "POST",
      originalUrl: "/api/data/create",
    } as Request;

    const mockRes = {} as Response;
    const mockNext = jest.fn();

    // Act
    errorLogger(mockError, mockReq, mockRes, mockNext as NextFunction);

    // Assert - verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const errorOutput = consoleErrorSpy.mock.calls[0][0];

    // Verify error log contains all required information
    expect(errorOutput).toContain("[EML] ERROR");
    expect(errorOutput).toContain("Method:    POST");
    expect(errorOutput).toContain("URL:       /api/data/create");
    expect(errorOutput).toContain("Status:    503");
    expect(errorOutput).toContain("Message:   Database connection failed");
    expect(errorOutput).toContain("Stack:     Error: Database connection failed");

    // Verify timestamp is in ISO format
    expect(errorOutput).toMatch(/Timestamp: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);

    // Verify divider is present
    expect(errorOutput).toContain("─".repeat(50));

    // Verify error is passed to next middleware
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(mockError);

    // Test with error that has no status (should default to 500)
    consoleErrorSpy.mockClear();
    mockNext.mockClear();

    const errorWithoutStatus = new Error("Unexpected error");

    errorLogger(errorWithoutStatus, mockReq, mockRes, mockNext as NextFunction);

    const secondErrorOutput = consoleErrorSpy.mock.calls[0][0];
    expect(secondErrorOutput).toContain("Status:    500");
    expect(mockNext).toHaveBeenCalledWith(errorWithoutStatus);
  });
});
