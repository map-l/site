import { registerSW } from "/prxy/register-sw.mjs";
import * as BareMux from "/prxy/baremux/index.mjs";
import { getFavicon, rAlert } from "./utils.mjs";

const connection = new BareMux.BareMuxConnection("/prxy/baremux/worker.js");

export function search(input, template) {
  try {
    return new URL(input).toString();
  } catch (err) {}

  try {
    const url = new URL(`http://${input}`);
    if (url.hostname.includes(".")) return url.toString();
  } catch (err) {}

  return template.replace("%s", encodeURIComponent(input));
}

export async function getUV(input) {
  try {
    await registerSW();
    rAlert("SW ✓");
  } catch (err) {
    rAlert(`SW failed to register.<br>${err.toString()}`);
    throw err;
  }

  let url = search(input, "https://html.duckduckgo.com/html?t=h_&q=%s");

  let wispUrl = "wss://wisp.rhw.one/";
  if ((await connection.getTransport()) !== "/prxy/epoxy/index.mjs") {
    await connection.setTransport("/prxy/epoxy/index.mjs", [
      { wisp: wispUrl },
    ]);
  }
  if ((await connection.getTransport()) !== "prxy/libcurl/libcurl.mjs") {
    await connection.setTransport("/prxy/libcurl/libcurl.mjs", [
      { wisp: wispUrl },
    ]);
  }

  let viewUrl = __uv$config.prefix + __uv$config.encodeUrl(url);

  return viewUrl;
}
