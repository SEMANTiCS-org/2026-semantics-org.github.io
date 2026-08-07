## Scanner Setup & Operational Guide

### Initial Hardware Configuration
Before using this webpage for the first time, your badge scanner must be configured to **Virtual COM Port (Serial) Mode**. By default, most scanners operate in Keyboard Emulation mode. Locate the instruction manual that came with your hardware and scan the configuration barcode or QR code labeled **USB COM Port Emulation**, **Virtual COM**, or **USB Serial**. This changes the internal mode of the scanner so it communicates via a dedicated serial stream rather than typing characters like a keyboard.

### Connecting the Device
Plug your badge scanner into a USB port on your computer. Click the blue **Connect Scanner** button at the top of this page. A pop-up menu will display your available hardware devices. Select your badge scanner from the list, typically appearing under a name such as **TOT2D PRODUCT USB UART** or **USB Serial Device**, and click **Connect**. Once successfully paired, the status indicator in the top-right corner will switch to green and show **Connected**.

### Recording Scans
Point your scanner at any badge barcode or QR code. Each scan immediately logs the exact timestamp and code contents into the live console box below. The total scan counter updates automatically after every badge, allowing you to monitor your headcount in real time.

### Working in Other Applications
You can freely navigate away from this tab, check emails, or work in other software while scanning badges. Because this webpage connects directly to your device via a serial stream, incoming scans will only record inside the console on this page. They will never accidentally type into your active windows or open documents.

### Saving and Exporting Data
When you finish your scanning session, click **Export (.CSV)** to download a complete spreadsheet file compatible with Microsoft Excel or Apple Numbers. If you require a raw log format, click **Export (.TXT)** instead. Both options save directly into your computer's standard Downloads folder.
When you finish your scanning session, click **Export (.CSV)** to download a complete spreadsheet file compatible with Microsoft Excel or Apple Numbers. Click **Export (.TXT)** if you require a raw log format. For advanced semantic data workflows, click **Export (.TTL)** to download the scan logs formatted as a Turtle Knowledge Graph built using *Schema.org* and the *Sensor, Observation, Sample, and Actuator (SOSA)* ontology. All exported files save directly into your computer's standard Downloads folder.

### Session Safety & Resetting
If your browser closes unexpectedly or the page refreshes, your logged scans remain safely saved in local memory. Reopening the page restores your complete log history and re-establishes your scanner connection. To clear out old data before starting a new session, click **Clear History** and confirm your selection.

### Troubleshooting
If the scanner fails to connect or throws an access error, it is almost certainly because the hardware is already open in another program (such as a terminal window, serial monitor, or another browser tab). USB serial hardware can only connect to one application at a time. Close any other software or browser windows currently using the device, unplug the scanner, reconnect it, and try clicking **Connect Scanner** again.

### Browser Compatibility
This web application relies on the Web Serial API to communicate directly with your USB hardware. It is fully supported on desktop versions of **Google Chrome**, **Firefox**, **Microsoft Edge**, and **Opera**. It will not function on Apple Safari or Mozilla Firefox, as those browsers do not support direct serial hardware access.

### Where is Your Data Stored? (Privacy & Security)
**This application runs entirely client-side inside your web browser.** No scan data, timestamps, or personal information are ever transmitted to an external server or remote database over the internet. Everything is processed locally on your machine and stored strictly within your browser's private localStorage. Because no remote database or server communication is involved, no user login or authentication layer is required. Your data remains completely private to your device and is only accessible by you when you choose to export it.