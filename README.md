# **Video Downloader Extension**

This is a Google Chrome extension that identifies and records videos from the active tab, allowing you to download the video directly to your macOS downloads folder.

## **Features**

- **Identifies videos** on the active browser tab.
- **Records the playing video** and starts downloading automatically when the video finishes.
- The recording is automatically saved to the **downloads folder**, using the page title as the file name.

## **Troubleshooting**

- **Error: "Tab ID not found"**: Make sure the page with the video is active when starting the recording.
- **Error: "No video found."**: The extension only works with videos in `<video>` elements. Some websites protect videos with DRM, which may prevent recording.

## **Customization**

If you wish to change the default file name or adjust the recording behavior, you can edit the `content.js` file.

## **Contributing**

Contributions are welcome! Feel free to open issues or pull requests for improvements.

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for more details.
