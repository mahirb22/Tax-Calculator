import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import fetchMock from "jest-fetch-mock";
import { rest } from "msw";
import { setupServer } from "msw/node";
import useFetch from "../useFetch";

fetchMock.enableMocks();

afterEach(() => {
  fetchMock.resetMocks();
});

const API_URL = "https://api.example.com/data";

const mockData = {
  id: 1,
  name: "Sample Name",
};

const server = setupServer(
  rest.get(API_URL, (req, res, ctx) => {
    return res(ctx.json(mockData));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Test component that uses the useFetch hook and renders its output
function TestComponent() {
  const { data, loading, error, fetchData, retries } =
    useFetch<typeof mockData>(API_URL);

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {data && <div>{data.name}</div>}
      <div data-testid="retries">Retries: {retries}</div>{" "}
    </div>
  );
}

describe("useFetch", () => {
  test("fetches data successfully and updates the state", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockData));
    render(<TestComponent />);

    fireEvent.click(screen.getByText("Fetch Data"));

    await waitFor(
      () => expect(screen.getByText(mockData.name)).toBeInTheDocument(),
      {
        timeout: 5000,
      }
    );
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });

  test("handles errors and updates the error state", async () => {
    fetchMock.mockResponseOnce("", { status: 500 });
    server.use(
      rest.get(API_URL, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<TestComponent />);

    fireEvent.click(screen.getByText("Fetch Data"));

    await waitFor(() => expect(screen.getByText(/Error:/)).toBeInTheDocument());
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.queryByText(mockData.name)).not.toBeInTheDocument();
  });

  test("retries fetching data up to 3 times on server errors", async () => {
    fetchMock.mockResponses(
      ["", { status: 500 }],
      ["", { status: 500 }],
      ["", { status: 500 }],
      [JSON.stringify(mockData), { status: 200 }]
    );
    server.use(
      rest.get(API_URL, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<TestComponent />);

    fireEvent.click(screen.getByText("Fetch Data"));

    await waitFor(
      () => {
        const retriesElement = screen.getByTestId("retries");
        expect(retriesElement.textContent).toContain("Retries: 1");
      },
      { timeout: 6000 }
    );

    await waitFor(
      () => {
        const retriesElement = screen.getByTestId("retries");
        expect(retriesElement.textContent).toContain("Retries: 2");
      },
      { timeout: 6000 }
    );

    await waitFor(
      () => {
        const retriesElement = screen.getByTestId("retries");
        expect(retriesElement.textContent).toContain("Retries: 3");
      },
      { timeout: 6000 }
    );
  }, 20000);
});
