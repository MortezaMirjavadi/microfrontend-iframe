/**
 * Opens an app in the host's bottom sheet
 *
 * @param appId - The ID of the app to open (must match the ID in the manifest)
 * @param path - The path to navigate to in the app (default: '/')
 * @param height - The height of the bottom sheet (default: '50vh')
 * @param hostOrigin - The origin of the host app (default: parent window's origin)
 * @returns boolean - Whether the message was sent successfully
 */
export function openAppInBottomSheet(
  appId: string,
  path: string = "/",
  height: string | number = "50vh",
  hostOrigin: string = window.parent !== window
    ? document.referrer
    : window.location.origin
): boolean {
  if (window.parent === window) {
    console.warn("Not in an iframe, cannot open bottom sheet");
    return false;
  }

  try {
    const targetOrigin = hostOrigin.startsWith("http")
      ? new URL(hostOrigin).origin
      : document.referrer
        ? new URL(document.referrer).origin
        : "*";

    window.parent.postMessage(
      {
        type: "openBottomSheet",
        appId,
        path,
        height,
      },
      targetOrigin
    );

    console.log(`Sent request to open ${appId} in bottom sheet`);
    return true;
  } catch (error) {
    console.error("Failed to send openBottomSheet message:", error);
    return false;
  }
}
