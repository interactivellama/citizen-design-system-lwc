import fetchMock from "jest-fetch-mock";

import { fetch, getJSON, postJSON } from "../fetch";

describe("fetch", () => {
  it("works", async () => {
    await fetch("/mock");
    expect(fetchMock).toHaveBeenCalledWith("/mock", {
      credentials: "same-origin"
    });
  });
});

describe("getJSON", () => {
  it("200", async () => {
    let data = { name: "Astro" };
    fetchMock.mockOnce(JSON.stringify(data), { status: 200 });
    let res = await getJSON("/mock");
    expect(fetchMock).toHaveBeenCalledWith("/mock", {
      credentials: "same-origin",
      headers: {
        Accept: "application/json; charset=utf-8"
      }
    });
    expect(res).toEqual(data);
  });
  it("500 (json)", async () => {
    let data = { error: "Fail" };
    fetchMock.mockOnce(JSON.stringify(data), {
      headers: { "Content-Type": "application/json;" },
      status: 500
    });
    let error = await getJSON("/mock").catch(errorJSON => errorJSON);
    expect(error).toEqual(data);
  });
  it("500", async () => {
    let data = { error: "Fail" };
    fetchMock.mockOnce(JSON.stringify(data), { status: 500 });
    let error = await getJSON("/mock").catch(error => error.message);
    expect(error).toEqual('Application error code 500 for "/mock"');
  });
});

describe("postJSON", () => {
  it("200", async () => {
    let body = { user: "1" };
    let data = { name: "Astro" };
    fetchMock.mockOnce(JSON.stringify(data), { status: 200 });
    let res = await postJSON("/mock", body);
    expect(fetchMock).toHaveBeenCalledWith("/mock", {
      body: JSON.stringify(body),
      credentials: "same-origin",
      headers: {
        Accept: "application/json; charset=utf-8",
        "Content-Type": "application/json; charset=utf-8"
      },
      method: "POST"
    });
    expect(res).toEqual(data);
  });
});
